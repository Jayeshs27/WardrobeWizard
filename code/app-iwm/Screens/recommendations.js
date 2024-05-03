import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight,
  TouchableNativeFeedback, Alert, Platform,
  Text, TextInput, View, Image, Button, ScrollView, Animated, FlatList
} from 'react-native';
import navigationOps from './navigation';
import { Header } from './components';
const bgImage = '../assets/back_unsplash.jpg';
const homeIcon = '../assets/homeIcon.png';
const recommendationPNG = '../assets/recommendations.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ip, port } from '../global'

const imageTags = {};

const RecommendationsScreen = ({ navigation }) => {
  const [isRecommended, setRecommended] = useState(false); // Initial value can be set to the desired top position
  const [searchQuery, setSearchQuery] = useState('');
  // const [prevQuery, setPrevQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [images, setImages] = useState([])
  const [top, setTop] = useState('')
  const [bottom, setBottom] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false);

  async function getImages() {
    try {
      const data = await AsyncStorage.getItem('isLoggedIn');
      if (data) {
        if (data === 'true') {
          const token = await AsyncStorage.getItem('token');
          const response = await axios.post(`http://${ip}:${port}/userdata`, { token: token })

          const result = await axios.get(`http://${ip}:${port}/get-all-items`, {
            params: {
              currentUser: response.data.data,
            }
          });
          const items = result.data.map((item, index) => ({
            id: item._id,
            Tags: item.Tags,
            ImageSrc: `http://${ip}:${port}/${item.Path}`
          }));

          setImages(items);
        }
        else {
          console.log("Fatal error: User not logged in");
          // This should be changed to display a message on the screen
          return;
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getImages();
  });

  const sendQuery = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://${ip}:${port}/recommend`, { 'input': searchQuery, 'clothes': images });

      if (!response.data['top'] && !response.data['bottom']) {
        setMessage('No clothes match the occasion');
        setTop('')
        setBottom('')
      }
      else if (!response.data['top']) {
        setMessage('You have no good tops for the occasion');
        setTop('')
        setBottom(response.data['bottom'])
      }
      else if (!response.data['bottom']) {
        setMessage('You have no good bottoms for the occasion');
        setTop(response.data['top'])
        setBottom('');

      }
      else {
        setMessage('')
        setTop(response.data['top'])
        setBottom(response.data['bottom'])
      }
      setRecommended(true);

      setTop(response.data['top'])
      setBottom(response.data['bottom'])
      setLoading(false);
    }

    catch (err) {
      setLoading(false);
      console.log("This" + err);
    }
  }

  useEffect(() => {
    console.log("Top: ", top);
    console.log("Bottom: ", bottom);
  }, [top, bottom]);

  const handleKeyPress = () => {
    if (searchQuery != '') {
      sendQuery();
    }
  }

  const handleNewQuery = () => {
    setRecommended(false);
    setSearchQuery('');
    setTop('');
    setBottom('');
    setMessage('');
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground resizeMode="repeat" source={require(bgImage)} style={styles.Backimg}>
        <ScrollView style={styles.innercontainer} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>

          <Header navigation={navigation} isHome={false} isLoggedIn={true} navigationOps={navigationOps} />

          <View style={loading ? styles.contentBoxWhite : styles.contentBox}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Image
                  source={require('./../assets/loading.gif')}
                  style={styles.loadingGif}
                />
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                {!isRecommended && (
                  <View>
                    <TextInput
                      style={styles.recommendationInput}
                      placeholder='Search for recommendation'
                      value={searchQuery}
                      onChangeText={(text) => setSearchQuery(text)}
                      onSubmitEditing={handleKeyPress}
                    />
                    <View style={styles.recommendationPNGcontainer}>
                      <Image source={require(recommendationPNG)} style={styles.recommendationsPNG} />
                    </View>
                  </View>
                )}
                {(top || bottom) && (
                  <View>
                    <Text style={styles.RecommendationHeading}>Your Recommendations</Text>
                    <View style={styles.imageGrid}>
                      {top && (
                        <Image source={{ uri: top }} style={styles.recommendationsSVG} onError={(error) => console.log('Image loading error:', error)} />
                      )}
                      {bottom && (
                        <Image source={{ uri: bottom }} style={styles.recommendationsSVG} />
                      )}
                    </View>
                  </View>)}
                {isRecommended && (
                  <View>
                    <View style={styles.imageGrid}>
                      {/* <Text>Here will be the images</Text> */}
                    </View>
                    <View style={styles.recommendationsControl}>
                      <TouchableOpacity onPress={handleKeyPress}>
                        <Text style={styles.buttontext}>Regenerate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleNewQuery}>
                        <Text style={styles.buttontext}>New Search</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.messageView} >
                      {message && (<Text style={styles.message}> {message} </Text>)}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({

  container: { // screen
    flex: 1,
  },
  Backimg: {
    height: '100%',
  },
  innercontainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  // contains home,profile and time 
  headers: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    paddingTop: 50,
  },
  // title box 
  homeTitlebox: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 70,
    fontWeight: 'bold',
    color: 'white',
  },
  // contains profile logo and home logo
  upperBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // profile 
  profileLogo: {
    backgroundColor: 'white',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 30,
    profileText: {
      fontSize: 15,
    },
  },

  // home
  homeiconBox: {
    height: 40,
    width: 40,
    marginLeft: 30,
  },
  homeicon: {
    flex: 1,
  },
  // Content starts here
  contentBox: {
    // position: 'sticky',
    width: '100%',
    marginBottom: 0,
    // justifyContent: 'center',
    alignItems: 'left',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#E3E3E3',
    paddingBottom: 100,
    minHeight: 670,
  },
  contentBoxWhite: {
    width: '100%',
    marginBottom: 0,
    // justifyContent: 'center',
    alignItems: 'left',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'white',
    paddingBottom: 100,
    minHeight: 670,
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

  RecommendationHeading: {
    fontSize: 35,
    paddingHorizontal: 20,
    marginTop: 50,
    // backgroundColor:'red',
    textAlign: 'center',
  },
  // Your Favorites HomePage Image Grid
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // marginBottom: 20,
    padding: 20,
    marginTop: 10,
  },
  imageItem: {
    width: '46.25%',
    aspectRatio: 1,
    borderRadius: 10,
    marginVertical: 10,
  },

  recommendationInput: {
    marginTop: 60,
    height: 45, // adjust the height to make it more visible
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 30,
    borderColor: '#7E30E1',
    borderWidth: 1,
    display: 'flex',
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // overflow: 'hidden', // hide overflow content
    paddingHorizontal: 30,
    top: -10,
    // zIndex: 3,
  },
  recommendationPNGcontainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red',
    height: 400,
  },
  recommendationsSVG: {
    height: 150,
    width: 150,
  },
  recommendationsPNG: {
    height: 200,
    width: 200,
    opacity: 0.6,
  },

  recommendationsControl: {
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red',
    alignSelf: 'center',
  },

  buttontext: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 20,
    //  margin:10,
    borderRadius: 10,
    backgroundColor: '#a38679',
    color: '#E3E3E3',
  },
  messageView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    padding: 30,
    // backgroundColor:'green',

  },
  message: {
    // paddingVertical:100,
    fontSize: 15,
    alignSelf: 'center',
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(33,36,45, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGif: {
    width: 400,
    height: 400,
  },
});


export default RecommendationsScreen;