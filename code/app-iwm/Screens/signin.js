import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight,
  TouchableNativeFeedback, Alert, Platform,
  Text, View, Image, Button, ScrollView, Animated, FlatList, TextInput
} from 'react-native';
import axios from "axios";
import { ip, port } from '../global.js'
import { Header } from './components.js'

import AsyncStorage from '@react-native-async-storage/async-storage';

import '../assets/icon.png'
import navigationOps from './navigation';
import { saveSessionToken } from '../session.js';
const bgImage = "../assets/back_unsplash.jpg";
const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ErrorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`http://${ip}:${port}/signin`, {
        email: email,
        password: password,
      });
      if (response.data.success) {
        console.log(response.data);
        await AsyncStorage.setItem("token", response.data.data);
        await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
        setEmail('');
        setPassword('');
        navigationOps.goToHome(navigation);
      }
      else {
        setErrorMessage(response.data.message);
      }
    }
    catch (error) {
      console.error('Error during sign in:', error.message);
    }
  }
  useEffect(() => {
    setErrorMessage('')
  }, [email, password, navigation]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground resizeMode='repeat' source={require(bgImage)} style={{ height: "100%" }}>
        <ScrollView style={styles.innercontainer} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
          <Header isHome={false} navigation={navigation} navigationOps={navigationOps} isLoginPage={true} />
          <View style={styles.contentBox}>
            <Text style={styles.headingText}>
              Welcome Back! Please login to continue
            </Text>
            <View style={styles.FormView}>
              <Text style={styles.FormHeading}>
                Email:
              </Text>
              <TextInput placeholder={"Email your email*"} placeholderTextColor={"#808080"} style={styles.TextInput}
                onChangeText={(text) => setEmail(text)} />
              <Text style={styles.FormHeading}>
                Password:
              </Text>
              <TextInput placeholder={"Password*"} secureTextEntry={true} placeholderTextColor={"#808080"} style={styles.TextInput}
                onChangeText={(text) => setPassword(text)} />
              {ErrorMessage ? <Text style={styles.ErrorMessage}>{ErrorMessage}</Text> : null}
              <TouchableOpacity style={styles.Button} onPress={handleSignIn}>
                <Text style={styles.ButtonText}> Sign In</Text>
              </TouchableOpacity>
              <View style={styles.signUpOption}>
                <Text>
                  Don't have an account? &nbsp;
                </Text>
                <TouchableOpacity style={styles.signUpButton} onPress={() => navigationOps.goToSignUp(navigation)}>
                  <Text style={styles.signUpText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </ScrollView>
      </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({

  innercontainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  contentBox: {
    width: '100%',
    marginTop: 10,
    display: 'flex',
    paddingTop: 50,
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#E3E3E3',
    minHeight: 650,
  },
  headingText: {
    width: '90%',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D0C57',
  },
  FormView: {
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  FormHeading: {
    fontWeight: 'bold',
    marginTop: 10,
    width: "100%",
    marginLeft: 20,
    marginHorizontal: 20,
  },
  TextInput: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#808080',
    height: 53,
    borderRadius: 20,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    color: '#000',
    marginHorizontal: 20,
  },
  Button: {
    width: '90%',
    color: 'white',
    height: 52,
    backgroundColor: '#a38679',
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  ButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#E3E3E3'
  },
  signUpOption: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },
  signUpText: {
    color: '#bf9260',
  },
  ErrorMessage: {
    alignSelf: 'center',
    color: 'red',
  },
})
export default SignInScreen;
 