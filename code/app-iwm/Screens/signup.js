// import React from 'react';
import {Text, StyleSheet, Button, View, ScrollView, Image, TextInput, ImageBackground} from 'react-native';
import { Picker } from '@react-native-picker/picker'
import '../assets/icon.png'
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import navigationOps from './navigation';
import React, { useRef, useState, useEffect } from 'react';
import { ip,port } from '../global.js'
import { Header } from './components';

const bgImage = "../assets/back_unsplash.jpg";

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [about, setAbout] = useState('');
  const [gender, setGender] = useState('Male');
  const [pronouns, setPronouns] = useState('');
  const [mobile, setMobile] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const checkValidEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(text);
    if (isValidEmail || text == '') {
       return true;
    }
    return false; 
  };

  const handleSignUp = async () => {
      if(!checkValidEmail(email)){
         setErrorMessage('Invalid email address');
         return;
      }
      else{
        try {
          const response = await axios.post(`http://${ip}:${port}/signup`, {
              name: name,
              email: email,
              password: password,
              confirmPassword: confirmPassword,
              mobile: mobile,
              gender: gender,
          });

          if (response.data.success) {
              navigationOps.goToSignIn(navigation);
              setName('');
              setAge('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setAbout('');
              setGender('');
              setPronouns('');
              setMobile('');
          } else {
              setErrorMessage(response.data.message);
          }
        } catch (error) {
            console.error('Error during sign up:', error.message);
        }
      }
  };
  
  useEffect(() => {
    setErrorMessage('')
  }, [name, email, password, confirmPassword, gender, mobile, navigation]);

  return(
    <View style = {{flex:1}}>
      <ImageBackground style = {{height:"100%"}} resizeMode='repeat' source={require(bgImage)}>
        <ScrollView style = {styles.innercontainer} scrollEventThrottle = {16} showsVerticalScrollIndicator = {false}>
          <Header isHome={false} isLoginPage={true} navigation={navigation} navigationOps={navigationOps}/>
          <View style={styles.contentBox}>
            <Text style = {styles.headingText}>
              Sign Up! Start a new Trend
            </Text>
            <View style={styles.FormView}>

              <TextInput placeholder={"Full name*"} placeholderTextColor={"#808080"} 
                style={styles.TextInput} onChangeText={(text) => setName(text)}/>
              <TextInput placeholder={"Email address"}  keyboardType='email-address' placeholderTextColor={"#808080"} 
                style={styles.TextInput} onChangeText={(text) => setEmail(text)}/>
              <TextInput placeholder={"Mobile*"} keyboardType='numeric'
                 placeholderTextColor={"#808080"} style={styles.TextInput} onChangeText={(text)=>setMobile(text)}/>
              <TextInput placeholder={"Password*"} placeholderTextColor={"#808080"} secureTextEntry={true} style={styles.TextInput}onChangeText={(text)=>setPassword(text)}/>
              <TextInput placeholder={"Confirm Password*"} secureTextEntry={true} 
                placeholderTextColor={"#808080"} style={styles.TextInput} onChangeText={(text)=>setConfirmPassword(text)}/>

              <Picker style = {styles.TextInput} selectedValue={gender} placeholder='Gender'
                 mode='dropdown' prompt='Select Gender' placeholderTextColor={"#808080"} 
                onValueChange={(choice) => setGender(choice)}>
                <Picker.Item label = "option" value = "Select Option"/>
                <Picker.Item label = "Male" value = "Male"/>
                <Picker.Item label = "Female" value = "Female"/>
                <Picker.Item label = "Other" value = "Other"/>
              </Picker>
              {errorMessage ? <Text style={styles.ErrorMessage}>{errorMessage}</Text> : null}
              <TouchableOpacity style = {styles.signUpButton} onPress={handleSignUp}>
                <Text style = {styles.signUpButtonText}> Sign Up</Text>
              </TouchableOpacity>
              <View style={styles.signInOption }>
                <Text>
                  Already a user? &nbsp;
                </Text>
                <TouchableOpacity onPress={() => navigationOps.goToSignUp(navigation)}>
                  <Text style={styles.signInText} onPress={() => navigationOps.goToSignIn(navigation)}>login</Text>
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
    paddingTop: 50,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#E3E3E3',
    minHeight: 700,
  },
  headingText : { 
    width:'90%',
    fontSize: 28,
    fontWeight: 'bold', 
    color: '#2D0C57', 
    alignSelf: 'center',
  },
  TextInput:{
    width:'90%',
    borderWidth:1,
    borderColor:'#808080',
    height:45,
    borderRadius:20,
    paddingLeft: 10,
    marginTop: 10,
    color: '#000'
  },
  FormView:{
    width:'100%',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginTop: 30
  },
  FormHeading:{
    fontWeight: 'bold',
    // paddingLeft: 10,
    marginTop: 10,
    textAlign: 'left',
  },
  signUpButton:{
    width:'90%',
    color:'white',
    height: 52,
    backgroundColor:'#a38679',
    borderRadius: 10,
    marginTop:20,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  signUpButtonText:{
    fontWeight: 'bold',
    color:'#E3E3E3',
    fontSize: 18
  },
  TextButton:{
    display:'flex',
    alignItems:'center',
    marginTop:20
  },
  ErrorMessage: {
    marginTop: 10,
    alignSelf: 'center',
    color: 'red',
  },
  signInOption: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },
  signInText: {
    color:'#bf9260',
  },

})

export default SignUpScreen;
