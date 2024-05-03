import React, { useState } from 'react';
import {
  StyleSheet, ImageBackground, TouchableOpacity, 
  Text, View, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ip,port} from '../global.js'

import { AntDesign } from '@expo/vector-icons';

function abbreviateName(name) {
  if (name.includes(' ')) {
      const parts = name.split(' ');
      return parts.map(part => part[0].toUpperCase()).join('');
  } else {
      return name.substring(0, 2).toUpperCase();
  }
}

const Header = ({ isHome, navigation, navigationOps, isLoginPage }) => { 

  const [isLoggedIn,setLoggedIn] = useState(false);
  const [user,setUser] = useState('');

  async function getData(){
    const data = await AsyncStorage.getItem('isLoggedIn')
    if(data){
      setLoggedIn((data === 'false') ? false : true);
      if(data === 'true'){
        const token = await AsyncStorage.getItem('token');
        axios
        .post(`http://${ip}:${port}/userdata`, {token: token})
        .then(res => {
          setUser(abbreviateName(res.data.data.name))
        })
      }
    }
  }
  
  getData();
  
    return(
      <View style={styles.headers}>
          <View style={styles.upperBox}>
              <TouchableOpacity onPress={() => navigationOps.goToHome(navigation)} style={styles.homeiconBox}>
                  {!isHome && (
                      <AntDesign name="home" size={40} color="white" /> 
                  )}
              </TouchableOpacity>
              {!isLoggedIn && !isLoginPage && (
                <TouchableOpacity style={styles.LoginButton} onPress={() => navigationOps.goToSignIn(navigation)} >
                    <Text title='' style={styles.LoginButton.LoginText}>Login</Text>
                </TouchableOpacity>
              )}
              {isLoggedIn && (
                <TouchableOpacity style={styles.profileLogo} onPress={() => navigationOps.goToProfile(navigation)} >
                    <Text title='' style={styles.profileLogo.profileText}>{user}</Text>
                </TouchableOpacity>
              )}
          </View>
          <View style={styles.homeTitlebox}>
              <Text style={styles.homeTitle}>Wardrobe Wizard</Text>
          </View>
      </View>
    )
}

var WardrobeItems = [
  {
    id: 1, Tags: ['Casualwear', 'Menswear', 'Black', 'T-shirt'],
    isFav: 1, ImageSrc: require('../assets/t_shirt.jpeg')
  },
  {
    id: 2, Tags: ['Casualwear', 'Menswear', 'Yellow', 'T-shirt'],
    isFav: 0, ImageSrc: require('../assets/t_shirt_yellow.jpg')
  },
  {
    id: 3, Tags: ['Businesswear', 'Menswear', 'Black', 'T-shirt'],
    isFav: 1, ImageSrc: require('../assets/image5.jpg')
  },
  {
    id: 4, Tags: ['Casualwear', 'Womenswear', 'Black', 'T-shirt'],
    isFav: 1, ImageSrc: require('../assets/image4.jpg')
  },
  {
    id: 5, Tags: ['Partywear', 'Womenswear', 'Yellow', 'T-shirt'],
    isFav: 0, ImageSrc: require('../assets/image3.jpg')
  },
  {
    id: 6, Tags: ['Businesswear', 'Womenswear', 'Black', 'T-shirt'],
    isFav: 1, ImageSrc: require('../assets/image6.jpg')
  },
  {
    id: 7, Tags: ['Partywear', 'Womeswear', 'Black', 'T-shirt'],
    isFav: 0, ImageSrc: require('../assets/image1.jpg')
  },
  {
    id: 8, Tags: ['Partywear', 'Menswear', 'Yellow', 'T-shirt'],
    isFav: 0, ImageSrc: require('../assets/image2.jpg')
  },
]

const UserCustomization = ({ navigation,navigationOps }) => {

  const [favouriteItems, setfavouriteItems] = useState([]);

  async function getFavouriteItems(){
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
  
            const items = result.data
            .filter(item => item.isFav === true) // Filter to include only items where isFav is true
            .map((item) => ({
                id: item._id,
                Tags: item.Tags,
                isFav: item.isFav,
                ImageSrc: `http://${ip}:${port}/${item.Path}`
            }));
            setfavouriteItems(items);
            // console.log("favourite items: ")
            // console.log(favouriteItems);
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

    getFavouriteItems();
   
   return(
    <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={() => navigationOps.goToWardrobe(navigation)}>
          <View style={{ justifyContent: 'center', alignItems: 'center', width: 80, height: 80, borderRadius: 50, paddingTop: 60, paddingLeft: 10 }}>
            <ImageBackground source={require('../assets/oval.png')} style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../assets/Vector.png')} style={{ width: 50, height: 50 }} />
            </ImageBackground>
            <Text style={{ fontSize: 15, color: '#2D0C57' }}>Wardrobe</Text>
          </View> 
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigationOps.goToTrends(navigation)}>
          <View style={{ justifyContent: 'center', alignItems: 'center', width: 80, height: 80, borderRadius: 50, paddingTop: 60, paddingLeft: 10 }}>
            <ImageBackground source={require('../assets/oval.png')} style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../assets/Vector2.png')} style={{ width: 50, height: 50 }} />
            </ImageBackground>
            <Text style={{ fontSize: 15, color: '#2D0C57' }}>Trending</Text>
          </View>  
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigationOps.goToRecommendations(navigation)}>
          <View style={{ justifyContent: 'center', alignItems: 'center', width: 80, height: 80, borderRadius: 50, paddingTop: 60, paddingLeft: 10 }}>
            <ImageBackground source={require('../assets/oval.png')} style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../assets/Vector3.png')} style={{ width: 50, height: 50 }} />
            </ImageBackground>
            <Text style={{ fontSize: 15, color: '#2D0C57' }}>Custom</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={{ fontSize: 35, fontWeight: 'bold', color: '#2D0C57', paddingTop: 80, paddingLeft: 10, paddingBottom: 10, textAlign: 'left' }}>Your Favorites</Text>
        <View style={styles.imageGrid}>
          {favouriteItems.map((item) => (
            <View  key={item.id} >
              <Image source={{ uri : item.ImageSrc }} style={styles.imageItem}  />
            </View>
          ))}
        </View>
      </View>
  </View>
   )
}

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
      display:'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // textAlign:'center',
      // backgroundColor:'red',
    },
    homeTitle: {
      fontSize:42,
      fontWeight: 'bold',
      color: 'white',
      textAlign:'center',
    },
    // contains profile logo and home logo
    upperBox: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    // login
    LoginButton: {
      width: 60,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 30,
      borderColor: 'white',
      borderWidth: 2,
      LoginText: {
        color: 'white',
      }
      // backgroundColor: 'red',
    },
    // profile 
    profileLogo: {
      // backgroundColor: 'white',
      borderColor: 'white',
      borderWidth: 2,
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      marginRight: 30,
      profileText: {
        fontSize: 15,
        color: 'white',
      },
    },
    // home
    homeiconBox: {
      marginLeft: 30,
    },

    // Your Favorites HomePage Image Grid
    imageGrid: {
      width: '90%',
      alignSelf: 'center',
      display:'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: 15,
    },
    imageItem: {
      width:165,
      aspectRatio:1,
      borderRadius: 10,
      padding: 30,
    },
  });
  
export {Header as Header,UserCustomization as UserCustomization}