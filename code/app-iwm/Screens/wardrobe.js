import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight,
  TouchableNativeFeedback, Alert, Platform,
  Text, View, Image, Button, ScrollView, Animated, FlatList
} from 'react-native';
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
const bgImage = '../assets/back_unsplash.jpg';
import navigationOps from './navigation';
import { Header }  from './components';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ip,port } from '../global'
const emptyWardrobePNG = '../assets/empty-wardrobe.png'


const Tags = [
    'Casualwear', 'Partywear', 'Formalwear'
]

async function DeleteItemFromDB(item){
  try {
    const data = await AsyncStorage.getItem('isLoggedIn')
    if(data){
      if(data === 'true'){
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(`http://${ip}:${port}/userdata`, {token: token})
        const query = {
          currentUser:response.data.data,
          item:item
        }
        const result = await axios.post(`http://${ip}:${port}/delete-item`,query);
        if(result.data.success){
          console.log(`Image removed successfully : ${item.ImageSrc}`)
          return true;
        }
        return false;
      }
      else{
        console.log("Fatal Error: User not logged In");
        return false;
      }
    }
  }
  catch(err){
    console.log(err);
  }
}

async function UpdateLikeOption(item){
  try {
    const data = await AsyncStorage.getItem('isLoggedIn')
    if(data){
      if(data === 'true'){
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(`http://${ip}:${port}/userdata`, {token: token})

        const query = {
          currentUser:response.data.data,
          item:item
        }
        const result = await axios.post(`http://${ip}:${port}/toggle-like-option`,query);
        console.log(result.data);
      }
      else{
        console.log("Fatal Error: User not logged In");
        return;
      }
    }
  }
  catch(err){
    console.log(err);
  }
}

const WardrobeScreen = ({ navigation }) => {

  const [WardrobeItems, setWardrobeItems] = useState([]);
  const [filteredItems, setfilteredItems] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

    async function getAllItems(){
      try {
        const data = await AsyncStorage.getItem('isLoggedIn')
        if(data){
          if(data === 'true'){
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`http://${ip}:${port}/userdata`, {token: token})

            const result = await axios.get(`http://${ip}:${port}/get-all-items`,{
              params: {
                currentUser: response.data.data,
              }
            });

            items = result.data.map((item, index) => ({
              id: item._id,
              Tags: item.Tags,
              isFav: item.isFav,
              ImageSrc:`http://${ip}:${port}/${item.Path}`
            }));
            setWardrobeItems(items);
            setfilteredItems(items);
          }
          else{
            console.log("Fatal Error: User not logged In");
            return;
          }
        }
      }
      catch(err){
        console.log(err);
      }
    }
    // useEffect(() => {
    //   getAllItems();
    // },[]);
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getAllItems();
      });

      return unsubscribe;
    }, [navigation]);

    const toggleTag = (tag) => {
      if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
      } else {
        setSelectedTags([...selectedTags, tag]);
      }
    };

    useEffect(() => {
      const updatedFilteredItems = selectedTags.length > 0
        ? WardrobeItems.filter(item => item.Tags.some(tag => selectedTags.includes(tag)))
        : WardrobeItems;
        setfilteredItems(updatedFilteredItems);
    }, [selectedTags, WardrobeItems]);

    const toggleLikeOption = (likedItem) => {

      const isToggled = UpdateLikeOption(likedItem);

      setfilteredItems(prevItems => {
        return prevItems.map(item => {
          if (item.id === likedItem.id) {
            return { ...item, isFav: item.isFav ? 0 : 1 }; // Toggle the isFav property
          }
          return item;
        });
      });
    };

   const DeleteItem = (removedItem) => {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this item?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: 'Delete',
            onPress: () => {
              const isRemoved = DeleteItemFromDB(removedItem);
              if(isRemoved){
                const updatedWardrobeItems = WardrobeItems.filter((item) => item.id !== removedItem.id);
                setWardrobeItems(updatedWardrobeItems);

                const updatedFilteredItems = filteredItems.filter((item) => item.id !== removedItem.id);
                setfilteredItems(updatedFilteredItems);
              }
            },
            style: 'destructive'
          }
        ],
        { cancelable: false }
      );
   }

    return (
      <View style={styles.container}>
        <ImageBackground resizeMode="repeat" source={require(bgImage)} style={styles.Backimg}>
          <ScrollView style={styles.innercontainer}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <Header isHome={false} navigation={navigation} navigationOps={navigationOps}/>

            <View style={styles.contentBox}>
              {/* <View style={styles.scrollContent}> */}
                <View style={styles.clothTags}>
                  {Tags.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.clothTags.Tag, selectedTags.includes(tag) && styles.clothTags.selectedTag]}
                      activeOpacity={1.0}
                      onPress={() => toggleTag(tag)}>
                      <Text style={[styles.clothTags.TagText, selectedTags.includes(tag) && styles.clothTags.selectedTagText]}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* <Text>{console.log(filteredItems)}</Text> */}
                {(filteredItems.length > 0) ?
                <View style={styles.ClothItemsContainer}>
                  {filteredItems.map((item) => (
                      <View key={item.id} style={styles.ClothItem}>
                        <Image style={styles.clothImage} source={{ uri: item.ImageSrc}} />
                        <View style={styles.clothDescription}>
                          <View style={styles.clothDescription.DescriptionTextBox}>
                            <Text style={styles.clothDescription.DescriptionText}>
                              {item.Tags.join('\n')}
                              </Text>
                          </View>
                          <View style={styles.clothDescription.DescriptionButtons}>
                            <TouchableOpacity onPress={() => toggleLikeOption(item)}>
                              <AntDesign
                                name={item.isFav ? 'heart' : 'hearto'}
                                style={[styles.clothDescription.LikeButton, item.isFav && styles.clothDescription.ActiveLikeButton]}
                                size={24}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => DeleteItem(item)}>
                              <AntDesign
                                name='delete'
                                style={styles.clothDescription.DeleteButton}
                                size={24}
                                />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                  ))}
                </View> :
                (
                  selectedTags.length > 0 ? (
                    <View style={styles.emptyWardrobeContainer}>
                      <Image style={styles.emptyWardrobePNGStyle} source={require(emptyWardrobePNG)}/>
                      <Text style={styles.emptyWardrobeText}>No clothes match the selected filters</Text>
                    </View>
                  ) : (
                    <View style={styles.emptyWardrobeContainer}>
                      <Image style={styles.emptyWardrobePNGStyle} source={require(emptyWardrobePNG)}/>
                      <Text style={styles.emptyWardrobeText}>Start Your Fashion Journey Now!
                        Add Your first Clothing item by pressing <Text style={{ fontSize:18 }}>+</Text>
                      </Text>
                    </View>
                  )
                )
                }

              {/* </View> */}
            </View>
          </ScrollView>
        </ImageBackground>

        <TouchableOpacity
          style={styles.AddButton}
          onPress={() => navigationOps.goToCamera(navigation)}
        >
         {/* <AntDesign name="pluscircle" size={65} color="#a9a1ad" /> */}
         <Entypo name="plus" size={65} color="white" style={{ backgroundColor: 'rgba(143, 108, 71,0.5)',borderRadius: 42,}}/>
        </TouchableOpacity>
      </View>
    );
  };


// Styles
const styles = StyleSheet.create({

    container: { // screen
      flex: 1,
    },
    Backimg: {
      height: '100%',
    },
    innercontainer: {
      flex: 1,
      display:'flex',
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    // Content starts here
    contentBox: {
      display:'flex',
      width: '100%',
      marginBottom: 0,
      alignItems: 'left',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      backgroundColor: '#E3E3E3',
      paddingTop: 15,
      paddingHorizontal: 15,
      paddingBottom: 10,
      // height: 1000,
      minHeight:700,
    },

    // clothes tags
    clothTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      Tag: {
        padding: 5,
        paddingHorizontal: 15,
        margin: 5,
        borderRadius: 25,
        backgroundColor: 'white',
        // background
      },
      TagText: {
        fontSize: 18,
        fontWeight: 'light',
        color: '#666562',
      },
      selectedTag: {
        backgroundColor: '#D2C9F4',
      },
      selectedTagText: {
        color: '#3914D1',
      }
      // borderRadius: 25,
    },

    // Cloth Items container
    ClothItemsContainer: {
      // height: 200,
      display: 'flex',
      flexDirection: 'column',
      marginTop: 20,
      marginBottom: 20,
    },
    ClothItem: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 20,
      marginBottom: 20,
    },
    clothImage: {
      height: 140,
      width: 180,
      borderRadius: 10,
    },
    clothDescription: {
      display: 'flex',
      flexDirection: 'coloumn',
      justifyContent: 'flex-end',
      marginLeft: 20,
      DescriptionTextBox: {
        display: 'flex',
        justifyContent: 'center',
        flex: 0.85,
        width: 160,
      },
      DescriptionText: {
	      color: '#666562',
      },
      DescriptionButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      LikeButton: {
        padding: 5,
        color: "#666562",
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 5,
      },
      ActiveLikeButton: {
        backgroundColor: '#FF5995',
        color: "white",
      },
      DeleteButton: {
        padding: 5,
        paddingHorizontal: 20,
        backgroundColor: '#FF4848',
        color: '#FFFFFF',
        borderRadius: 5,
      }
    },
    AddButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "rgba(100,100,100,0.2)",

      borderRadius: 50,
      position: 'absolute',
      bottom: 20,
      right: 20,
      addIcon: {
        margin: 0,
        backgroundColor: 'white'
      }
    },
    emptyWardrobeContainer: {
      // backgroundColor:'red',
      display:'flex',
      alignItems:'center',
      paddingHorizontal:60,
    },
    emptyWardrobePNGStyle: {
      height:250,
      width:250,
      opacity:0.3,
      marginTop:50,
    },
    emptyWardrobeText:{
      textAlign:'center',
      color:'grey',
    }

  });

export default WardrobeScreen;


// import React, { useRef, useState, useEffect } from 'react';
// import {
//   StyleSheet, ImageBackground, TouchableOpacity,
//   Text, View, ScrollView, Image, Button,
// } from 'react-native';
// // import { useFonts } from '@expo-google-fonts/Poppins';

// import deleteImage from '../assets/delete.png';
// import plusIcon from '../assets/addicon.png';
// import Header from './components';
// import navigationOps from './navigation';
// import axios from 'axios';
// import {ip,port} from '../global.js'

// const bgImage = '../assets/back_unsplash.jpg';
// const homeIcon = '../assets/homeIcon.png';
// const likeImage = require('../assets/like.png');
// const unlikeImage = require('../assets/unlike.png');

// const Tags = [
//   'Casualwear', 'Ethics', 'Partywear', 'Sportwear', 'Traditional'
// ]

// const WardrobeScreen = ({ navigation }) => {

//   const [WardrobeItems, setWardrobeItems] = useState([]);
//   const [filteredItems, setfilteredItems] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);

//   async function getAllItems(){
//     try {
//       const result = await axios.get(`http://${ip}:${port}/get-all-items`);
//       items = result.data.map((item, index) => ({
//           id: index + 1,
//           Tags: item.Tags,
//           isFav: 0,
//           ImageSrc:`http://${ip}:${port}/${item.Path}`
//       }));
//       setWardrobeItems(items);
//       setfilteredItems(items);
//     }
//     catch(err){
//       console.log(err);
//     }
//   }

//   useEffect(() => {
//     getAllItems();
//   },[]);

//   const toggleTag = (tag) => {
//     if (selectedTags.includes(tag)) {
//       setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
//     } else {
//       setSelectedTags([...selectedTags, tag]);
//     }
//   useEffect(() => {
//     const updatedFilteredItems = selectedTags.length > 0
//       ? WardrobeItems.filter(item => item.Tags.some(tag => selectedTags.includes(tag)))
//       : WardrobeItems;
//       setfilteredItems(updatedFilteredItems);
//   }, [selectedTags, WardrobeItems]);

//   const toggleLikeOption = (itemId) => {
//     setfilteredItems(prevItems => {
//       return prevItems.map(item => {
//         if (item.id === itemId) {
//           return { ...item, isFav: item.isFav ? 0 : 1 }; // Toggle the isFav property
//         }
//         return item;
//       });
//     });
//   };

//   const DeleteItem = (item) => {
//     console.log("delete pressed")
//   };

//   return (
//       <View style={styles.container}>
//         <ImageBackground resizeMode="repeat" source={require(bgImage)} style={styles.Backimg}>
//           <ScrollView style={styles.innercontainer}
//             scrollEventThrottle={16}
//             showsVerticalScrollIndicator={false}
//           >
//             <Header isHome={false} isLoggedIn={true} navigation={navigation} navigationOps={navigationOps}/>

//             <View style={styles.contentBox}>
//               {/* <View style={styles.scrollContent}> */}
//                 <View style={styles.clothTags}>
//                   {Tags.map((tag, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={[styles.clothTags.Tag, selectedTags.includes(tag) && styles.clothTags.selectedTag]}
//                       activeOpacity={1.0}
//                       onPress={() => toggleTag(tag)}>
//                       <Text style={[styles.clothTags.TagText, selectedTags.includes(tag) && styles.clothTags.selectedTagText]}>{tag}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//                 <View style={styles.ClothItemsContainer}>
//                   {filteredItems.map((item) => (
//                       <View key={item.id} style={styles.ClothItem}>
//                         <Image style={styles.clothImage} source={{ uri: item.ImageSrc }} />
//                         <View style={styles.clothDescription}>
//                           <View style={styles.clothDescription.DescriptionTextBox}>
//                             <Text style={styles.clothDescription.DescriptionText}>
//                               {item.Tags.join('\n')}
//                             </Text>
//                           </View>
//                           <View style={styles.clothDescription.DescriptionButtons}>
//                             <TouchableOpacity onPress={() => toggleLikeOption(item.id)}>
//                               <AntDesign
//                                 name={item.isFav ? 'heart' : 'hearto'}
//                                 style={[styles.clothDescription.LikeButton, item.isFav && styles.clothDescription.ActiveLikeButton]}
//                                 size={24}
//                               />
//                             </TouchableOpacity>
//                             <AntDesign
//                               name='delete'
//                               style={styles.clothDescription.DeleteButton}
//                               size={24}
//                               onPress={() => DeleteItem(item)}
//                             />
//                           </View>
//                         </View>
//                       </View>
//                   ))}
//                 </View>

//               {/* </View> */}
//             </View>
//           </ScrollView>
//         </ImageBackground>

//         <TouchableOpacity
//           style={styles.AddButton}
//           onPress={() => navigationOps.goToCamera(navigation)}
//         >
//          <AntDesign name="pluscircle" size={65} color="#a9a1ad" />
//         </TouchableOpacity>
//       </View>
//     );
//   };
// };
//   // useEffect(() => {
//   //   const updatedFilteredItems = selectedTags.length > 0
//   //     ? WardrobeItems.filter(item => item.Tags.some(tag => selectedTags.includes(tag)))
//   //     : WardrobeItems;
//   //     setfilteredItems(updatedFilteredItems);
//   // }, [selectedTags, WardrobeItems]);

//   // const toggleLikeOption = (itemId) => {
//   //   setfilteredItems(prevItems => {
//   //     return prevItems.map(item => {
//   //       if (item.id === itemId) {
//   //         return { ...item, isFav: item.isFav ? 0 : 1 }; // Toggle the isFav property
//   //       }
//   //       return item;
//   //     });
//   //   });
//   // };

//   // const DeleteItem = (item) => {
//   //   console.log("delete pressed")
//   // };

//   // // let [fontsLoaded] = useFonts({
//   // //   Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
//   // //   'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
//   // // });

//   // return (
//   //   <View style={styles.container}>
//   //     <ImageBackground resizeMode="repeat" source={require(bgImage)} style={styles.Backimg}>
//   //       <ScrollView style={styles.innercontainer}
//   //         scrollEventThrottle={16}
//   //         showsVerticalScrollIndicator={false}
//   //       >
//   //         <Header isHome={false} navigation={navigation} navigationOps={navigationOps}/>

//   //         <View style={styles.contentBox}>
//   //           <View style={styles.clothTags}>
//   //             {Tags.map((tag, index) => (
//   //               <TouchableOpacity
//   //                 key={index}
//   //                 style={[styles.clothTags.Tag, selectedTags.includes(tag) && styles.clothTags.selectedTag]}
//   //                 activeOpacity={1.0}
//   //                 onPress={() => toggleTag(tag)}>
//   //                 <Text style={[styles.clothTags.TagText, selectedTags.includes(tag) && styles.clothTags.selectedTagText]}>{tag}</Text>
//   //               </TouchableOpacity>
//   //             ))}
//   //           </View>
//   //           <View style={styles.ClothItemsContainer}>
//   //             {filteredItems.map((item) => (
//   //                 <View key={item.id} style={styles.ClothItem}>
//   //                   <Image style={styles.clothImage} source={{ uri: item.ImageSrc}} />
//   //                   <View style={styles.clothDescription}>
//   //                     <View style={styles.clothDescription.DescriptionTextBox}>
//   //                       <Text style={styles.clothDescription.DescriptionText}>
//   //                         {item.Tags.join('\n')}
//   //                         </Text>
//   //                     </View>
//   //                     <View style={styles.clothDescription.DescriptionButtons}>
//   //                       <View style={styles.buttonContainer}>
//   //                         <TouchableOpacity onPress={() => toggleLikeOption(item.id)}>
//   //                           <Image source={item.isFav ? likeImage : unlikeImage} style={styles.clothDescription.LikeButton} />
//   //                         </TouchableOpacity>
//   //                       </View>
//   //                       <View style={styles.buttonContainer}>
//   //                         <TouchableOpacity onPress={() => DeleteItem(item)}>
//   //                           <Image source={deleteImage} style={styles.DeleteButton} />
//   //                         </TouchableOpacity>
//   //                       </View>
//   //                     </View>
//   //                   </View>
//   //                 </View>
//   //             ))}
//   //           </View>
//   //         </View>
//   //       </ScrollView>
//   //     </ImageBackground>

//   //     <TouchableOpacity
//   //       style={styles.AddButton}
//   //       onPress={() => navigationOps.goToCamera(navigation)}
//   //     >
//   //       <View style={styles.addButtonContent}>
//   //         <Image source={plusIcon} style={styles.plusIcon} />
//   //         <Text style={styles.addButtonLabel}></Text>
//   //       </View>
//   //     </TouchableOpacity>
//   //   </View>
//   // );
// // };

// // Styles
// const styles = StyleSheet.create({

//   container: { // screen
//     flex: 1,
//   },
//   Backimg: {
//     height: '100%',
//   },
//   innercontainer: {
//     flex: 1,
//     display:'flex',
//     backgroundColor: 'rgba(0, 0, 0, 0.35)',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderColor: 'red', // Border color
//     borderWidth: 3, // Border width
//     borderRadius: 10,
//     paddingHorizontal: 9,
//     paddingVertical: 4,
//     marginTop: 10, // adjust as needed
//   },
//   // Content starts here
//   contentBox: {
//     display:'flex',
//     width: '100%',
//     marginBottom: 0,
//     alignItems: 'left',
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     backgroundColor: '#E3E3E3',
//     paddingTop: 15,
//     paddingHorizontal: 15,
//     paddingBottom: 10,
//   },

//   // clothes tags
//   clothTags: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     Tag: {
//       padding: 5,
//       paddingHorizontal: 15,
//       margin: 5,
//       borderRadius: 25,
//       backgroundColor: 'white',
//       // background
//     },
//     TagText: {
//       fontSize: 18,
//       fontWeight: 'light',
//       color: '#666562',
//     },
//     selectedTag: {
//       backgroundColor: '#D2C9F4',
//     },
//     selectedTagText: {
//       color: '#3914D1',
//     }
//     // borderRadius: 25,
//   },

//   // Cloth Items container
//   ClothItemsContainer: {
//     // height: 200,
//     display: 'flex',
//     flexDirection: 'column',
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   ClothItem: {
//     display: 'flex',
//     flexDirection: 'row',
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   clothImage: {
//     height: 140,
//     width: 180,
//     borderRadius: 10,
//   },
//   clothDescription: {
//     display: 'flex',
//     flexDirection: 'coloumn',
//     justifyContent: 'flex-end',
//     marginLeft: 20,
//     DescriptionTextBox: {
//       display: 'flex',
//       justifyContent: 'center',
//       flex: 0.85,
//       width: 120,
//     },
//     DescriptionText: {
//       color: '#666562',
//     },
//     DescriptionButtons: {
//       display: 'flex',
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//     },
//     LikeButton: {
//       width: 24,
//       height: 24,
//     },
//   },
//   DeleteButton: {
//     width: 24, // Adjust width as needed
//     height: 24, // Adjust height as needed
//   },
//   AddButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: "#D0E7F0", // Light blue color
//     borderRadius: 60,
//     borderColor: '#6CB4EE',
//     borderWidth: 3, // Border width
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     width: 70, // Adjust width as needed
//     height:70, // Adjust height as needed
//   },
//   addButtonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: '5%',
//   },
//   plusIcon: {
//     width: 60, // Adjust icon width as needed
//     height: 60, // Adjust icon height as needed
//     marginRight: 10, // Space between icon and label
//   },
//   addButtonLabel: {
//     fontSize: 18, // Adjust font size as needed
//     fontWeight: 'bold', // Make the text bold
//     color: '#005A8D', // Same color as rounded rectangle
//     // fontFamily: 'Helvetica', // Use Poppins Google Font
//   },

// });

// export default WardrobeScreen;
