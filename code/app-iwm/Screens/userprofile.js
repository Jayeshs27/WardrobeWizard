import {Text, StyleSheet, Button, View, Alert, ScrollView, Image, TextInput, ImageBackground} from 'react-native';
import { Picker } from '@react-native-picker/picker'
import '../assets/icon.png';
import { TouchableOpacity } from 'react-native';
import navigationOps from './navigation';
import React, {useRef, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ip,port} from '../global.js'
import { Header } from './components';
// import ChangePassword from './changePassword.js';

const bgImage = '../assets/back_unsplash.jpg';

async function DeleteAccountFromDB(userEmail) {
    try {
        const data = {
          email: userEmail,
        };
        await AsyncStorage.setItem("token", "");
        await AsyncStorage.setItem("isLoggedIn", JSON.stringify(false));

        console.log(`query sent for /delete-account : ${data}`)
        const response = await axios.post(`http://${ip}:${port}/delete-account`, data);
        
        if(response.data.success){
            return true;
        }
        return false;

    } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
    } 
}

const UserProfileScreen = ({ navigation }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [gender, setGender] = useState("")
    const [errorMessage, seterrorMessage] = useState("")


    async function getData(){
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      axios
        .post(`http://${ip}:${port}/userdata`, {token: token})
        .then(res => {
          console.log(res.data);
          setName(res.data.data.name);
          setEmail(res.data.data.email);
          setMobile(String(res.data.data.mobile));
          setGender(res.data.data.gender);
        });
    }

    useEffect(() => {
      getData();
    }, []);

    async function saveData() {
        try {
          const data = {
            name: name,
            mobile: mobile,
            email: email,
            gender: gender,
          };
          console.log(`query sent for /profile-update : ${data}`)
          const response = await axios.post(`http://${ip}:${port}/profile-update`, data);

          if (response.data.success) {
            setName(response.data.name);
            setMobile(String(response.data.mobile));
            setGender(response.data.gender);
            // setGender()
            navigationOps.goToHome(navigation);
          } else {
            // Handle unsuccessful response
            seterrorMessage(response.data.message)
            console.log('Error modifying data:', response.data.message);
          }
        } catch (error) {
          // Handle network or other errors
          console.error('Error:', error);
        }
    }

    async function logout() {
        await AsyncStorage.setItem("token", "");
        await AsyncStorage.setItem("isLoggedIn", JSON.stringify(false));
        console.log("user removed(logout)")
        navigationOps.goToHome(navigation);
    }

    async function DeleteAccount(){
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this account?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: 'Delete',
                onPress: () => {
                  DeleteAccountFromDB(email)
                    .then(res => {
                        if(res){
                            navigationOps.goToHome(navigation);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
                 
                },
                style: 'destructive'
              }
            ],
            { cancelable: false }
          );
    }


    const ChangePassword = () => {
        navigationOps.goToChangePassword(navigation);
    }


    return (
        <View style = { {flex:1} }>
            <ImageBackground resizeMode='repeat' source={require(bgImage)} style={ {height:"100%"}}>

            <ScrollView style = { styles.innercontainer } scrollEventThrottle = {16} showsVerticalScrollIndicator = {false}>
                <Header isHome = {false} navigation = {navigation} navigationOps={navigationOps}/>

                    <View style={styles.contentBox}>
                        <Text style = { styles.headingText }>
                            Your Profile
                        </Text>
                    <View style = { styles.FormView }>
                        <Text style = { styles.FormHeading }>Name: </Text>
                        <TextInput style = { styles.TextInput }  defaultValue = { name  } onChangeText = {(text) => setName(text)}/>
                        <Text style = {styles.FormHeading }>Email ID: </Text>
                        <TextInput style = { styles.TextInput } defaultValue = { email } editable={false} />
                        <Text style = { styles.FormHeading }>Mobile number: </Text>
                        <TextInput style = { styles.TextInput } defaultValue = { String(mobile) } onChangeText = {(text) => setMobile(text)}/>
                        <Text style = { styles.FormHeading }>Gender: </Text>
                        <Picker style = { styles.TextInput } selectedValue = { gender } onValueChange = {(choice) => setGender(choice)}>
                            <Picker.Item label = "Male" value = "Male"/>
                            <Picker.Item label = "Female" value = "Female"/>
                            <Picker.Item label = "Other" value = "Other"/>
                        </Picker>
                        {errorMessage ? <Text style={styles.ErrorMessage}>{errorMessage}</Text> : null}
                        {/* <Text style = { styles.FormHeading }>Password: </Text> */}
                        {/* <TextInput style = { styles.TextInput } value = { password } onFocus = {changePassword}/> */}
                        <TouchableOpacity style = { styles.Button } onPress = { saveData }>
                            <Text style = { styles.ButtonText }>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = { styles.Button } onPress = { logout }>
                            <Text style = { styles.ButtonText }>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = { styles.Button } onPress = { ChangePassword }>
                            <Text style = { styles.ButtonText }>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = { styles.Button } onPress = { DeleteAccount }>
                            <Text style = { styles.ButtonText }>Delete Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>



            </ScrollView>
            </ImageBackground>
        </View>

    )
}


const styles = StyleSheet.create({
    mainView:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        backgroundColor:'#fff'
    },
    TopView:{
        width: '100%',
        height: '15%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    BottomView:{
        width: '100%',
        height: '90%',
        backgroundColor:'#fcf6e3',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    ImageStyle:{
        width:'100%',
        resizeMode:'contain'
    },
    Heading:{
        color:'#808080',
        fontSize:30,
        textAlign:'center',
        fontWeight : "bold"
    },
    TextInput:{
        width:'90%',
        borderWidth:1,
        borderColor:'#808080',
        height:53,
        borderRadius:20,
        paddingLeft: 10,
        marginTop: 10,
        color: '#000',
        marginLeft : "5%"
    },
    FixedInput : {
        width:'90%',
        borderWidth:1,
        borderColor:'#808080',
        height:53,
        borderRadius:20,
        paddingLeft: 10,
        marginTop: 10,
        color: '#000',
        marginLeft : "5%",
        backgroundColor : "#ffff66"
    },
    FormView:{
        width:'100%',
        display:'flex',
        flexDirection:'column',
    },
    FormHeading:{
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'left',
        width : "100%",
        marginLeft : "5%"
    },
    Button:{
        width:'90%',
        color:'white',
        height: 52,
        backgroundColor:'#a38679',
        borderRadius: 10,
        marginTop:20,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginLeft : "5%"
    },
    ErrorMessage: {
        alignSelf:'center',
        color:'red',
    },
    ButtonText:{
        color: '#E3E3E3',
        fontSize: 18
    },
    Last:{
        marginTop: 10
    },
    signUpText:{
        color:'grey'
    },
    TextButton:{
        display:'flex',
        alignItems:'center',
        marginTop:20
    },
    contentBox: {
        // position: 'sticky',
        width: '100%',
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'left',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#E3E3E3',
        paddingBottom: 100,
      },
      headingText : {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#2D0C57',
        paddingTop: 50,
        paddingLeft: 10,
        paddingBottom: 10,
        textAlign: 'left'
    },
    innercontainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
})

export default UserProfileScreen
