import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, ImageBackground, TouchableOpacity,
  Text, View, Image, ScrollView, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as commonItems from './common'
const bgImage = '../assets/back_unsplash.jpg';
const homeIcon = '../assets/homeIcon.png';
import navigationOps from './navigation';
import { Header,UserCustomization } from './components.js';

import trend_image_1 from '../assets/scrapped_images/image_1.jpg';
import trend_image_2 from '../assets/scrapped_images/image_2.jpg';
import trend_image_3 from '../assets/scrapped_images/image_3.jpg';
import trend_image_4 from '../assets/scrapped_images/image_4.jpg';
import trend_image_5 from '../assets/scrapped_images/image_5.jpg';
import trend_image_6 from '../assets/scrapped_images/image_6.jpg';
import trend_image_7 from '../assets/scrapped_images/image_7.jpg';
import trend_image_8 from '../assets/scrapped_images/image_8.jpg';
import trend_image_9 from '../assets/scrapped_images/image_9.jpg';
import trend_image_10 from '../assets/scrapped_images/image_10.jpg';
import trend_image_11 from '../assets/scrapped_images/image_11.jpg';
import trend_image_12 from '../assets/scrapped_images/image_12.jpg';
import trend_image_13 from '../assets/scrapped_images/image_13.jpg';
import trend_image_14 from '../assets/scrapped_images/image_14.jpg';
import trend_image_15 from '../assets/scrapped_images/image_15.jpg';
import trend_image_16 from '../assets/scrapped_images/image_16.jpg';
import trend_image_17 from '../assets/scrapped_images/image_17.jpg';
import trend_image_18 from '../assets/scrapped_images/image_18.jpg';
import trend_image_19 from '../assets/scrapped_images/image_19.jpg';
import trend_image_20 from '../assets/scrapped_images/image_20.jpg';

const trending_images = {
  1: trend_image_1,
  2: trend_image_2,
  3: trend_image_3,
  4: trend_image_4,
  5: trend_image_5,
  6: trend_image_6,
  7: trend_image_7,
  8: trend_image_8,
  9: trend_image_9,
  10: trend_image_10,
  11: trend_image_11,
  12: trend_image_12,
  13: trend_image_13,
  14: trend_image_14,
  15: trend_image_15,
  16: trend_image_16,
  17: trend_image_17,
  18: trend_image_18,
  19: trend_image_19,
  20: trend_image_20,
};

const HomeScreen = ({ navigation }) => {

    const [isLoggedIn,setLoggedIn] = useState(false);

    async function getData(){
      const data = await AsyncStorage.getItem('isLoggedIn')
      if(data){
        setLoggedIn((data === 'false') ? false : true);
      }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          getData();
        });

      return unsubscribe;
    }, [navigation]);


    const renderTrendingItem = ({ item }) => {
      return (
        <Image source={item} style={{ width: 150, height: 250, marginRight: 30, borderRadius: 20 }} />
      );
    };

    return (
      <View style={{ flex: 1 }}>
        <ImageBackground resizeMode="repeat" source={require(bgImage)} style={styles.Backimg}>
          <ScrollView style={styles.innercontainer} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>

            <Header isHome={true} navigation={navigation} navigationOps={navigationOps}/>
            <View style={styles.contentBox}>
              <Text style={{ fontSize: 35, fontWeight: 'bold', color: '#2D0C57', paddingTop: 50, paddingLeft: 10, paddingBottom: 10, textAlign: 'left' }}>What's Trending?</Text>
              <FlatList
                horizontal
                data={Object.values(trending_images)}
                renderItem={renderTrendingItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ marginTop: 10, marginLeft: 10 }}
                showsHorizontalScrollIndicator={false}
              />

              {/* {isLoggedIn &&
                  <Text>`{console.log("User-isLoggedIn")}`</Text>
              } */}
              {isLoggedIn &&
                  <UserCustomization navigation={navigation} navigationOps={navigationOps}/>
              }
              {!isLoggedIn &&
                <View style={styles.messageBox}>
                  <Text style={styles.messageText}>
                    Fulfill you fashion needs in one click
                  </Text>

                  <TouchableOpacity style={styles.LoginButton} onPress={() => navigationOps.goToSignIn(navigation)} >
                    <Text title='' style={styles.LoginButton.LoginText}>Login</Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  };

  // Styles
const styles = StyleSheet.create({

    container: {
      flex: 1,
    },
    Backimg: {
      height: '100%',
    },
    innercontainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    // Content starts here
    contentBox: {
      // position: 'sticky',
      width: '100%',
      marginBottom: 0,
      justifyContent: 'center',
      alignItems: 'left',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      backgroundColor: '#E3E3E3',
      paddingBottom: 150,
      minHeight: 700,
      // height: 1000,
    },
    scrollContent: {
      flex: 1,
      marginTop: 15,
      paddingHorizontal: 15,
    },

    // clothes tags
    clothTags: {
      // height:'10%',
      // backgroundColor: 'grey',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      Tag: {
        padding: 5,
        paddingHorizontal: 15,
        margin: 5,
        // marginHorizontal: 10,
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
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'white',
        // height: '40%',
        flex: 0.85,
        width: 160,
        // padding: 10,
      },
      DescriptionText: {
        // marginBottom: '30%',
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
    sampleText: {
      marginTop: 50,
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
    },

    // DROPDOWN STYLES
    dropdown: {
      height: 45, // adjust the height to make it more visible
      width: '90%',
      alignSelf: 'center',
      backgroundColor: 'white',
      borderRadius: 30,
      borderColor: '#7E30E1',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // hide overflow content
      paddingHorizontal: 10,
      top: -10,
      zIndex: 3,
    },
    dropdownText: {
      color: '#C7C8CC',
      fontSize: 16, // adjust font size for better visibility
      zIndex: 3,
    },
    dropdownOptions: {
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 20,
      borderColor: '#7E30E1',
      borderWidth: 1,
      alignSelf: 'center',
      zIndex: 3,
    },
    option: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      fontSize: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      color: '#000000',
      zIndex: 3,
    },
    AddButton: {
      // flex: 1,
      // padding: 0,
      // margin: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "rgba(100,100,100,0.2)",

      // backgroundColor: "white",
      borderRadius: 50,
      position: 'absolute',
      bottom: 20,
      right: 20,
      addIcon: {
        margin: 0,
        backgroundColor: 'white'
      }
    },
    messageBox: {
      display:'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 50,
    },
    messageText: {
      fontSize: 18,
      color: 'grey',
      marginBottom: 10,
    },

    loginButton: {
      color: 'grey',
    },
    LoginButton: {
      marginTop:20,
      width: 80,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 30,
      backgroundColor: '#bf9260',
      // borderWidth: 2,
      LoginText: {
        fontSize:20,
        color: '#E3E3E3',
      }
    },
});



  export default HomeScreen;
