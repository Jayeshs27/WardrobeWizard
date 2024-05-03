import { Text, StyleSheet, View, ScrollView,TextInput, TouchableOpacity, ImageBackground } from 'react-native'
import "../assets/icon.png"
import navigationOps from './navigation'
import React, { useState } from 'react'
import { Header } from './components';
const bgImage = '../assets/back_unsplash.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ip,port} from '../global.js'

const ChangePassword = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('');

    async function checkAndUpdatePassword() {
        try {
            const token = await AsyncStorage.getItem('token');
            axios
            .post(`http://${ip}:${port}/userdata`, {token: token})
            .then(res => {
                setEmail(res.data.data.email);
            
            const data = {
                email: res.data.data.email,
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            };
            console.log(`query sent : ${data}`)
                axios.post(`http://${ip}:${port}/password-update`, data)
                .then(res => {
                    if (res.data.success) {
                        navigationOps.goToProfile(navigation)
                    } else {
                      // Handle unsuccessful response
        
                      setErrorMessage(res.data.message)
                      console.log('Error modifying data:', response.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
                
            });
          } catch (error) {
            // Handle network or other errors
            console.error('Error:', error);
          }
    }

    return (
        <View style = { {flex:1} }>
        <ImageBackground resizeMode='repeat' source={require(bgImage)} style={ {height:"100%"}}>

        <ScrollView style = { styles.innercontainer } scrollEventThrottle = {16} showsVerticalScrollIndicator = {false}>
            <Header isHome = {false} navigation = {navigation} navigationOps={navigationOps}/>

                <View style={styles.contentBox}>
                    <Text style = { styles.headingText }>
                        Change Password
                    </Text>
                <View style = { styles.formView }>
                    <Text style = { styles.formHeading }>Old password: </Text>
                    <TextInput style = { styles.textInput } value = { oldPassword } onChangeText = {(text) => setOldPassword(text)}/>
                    <Text style = { styles.formHeading }>New password: </Text>
                    <TextInput style = { styles.textInput } value = {newPassword} onChangeText = {(text) => setNewPassword(text)}/>
                    <Text style = { styles.formHeading }>Confirm password: </Text>
                    <TextInput style = {styles.textInput} value = {confirmPassword} onChangeText = {(text) => setConfirmPassword(text)}/>
                    {errorMessage ? <Text style={styles.ErrorMessage}>{errorMessage}</Text> : null}
                    <TouchableOpacity style = { styles.button } onPress = { checkAndUpdatePassword }>
                        <Text style = { styles.buttonText }> Save password </Text>
                    </TouchableOpacity>
                </View>
                </View>

        </ScrollView>
        </ImageBackground>
        </View>
        // <View style = { styles.mainView }>
        //     <View style = { styles.topView}>

        //     </View>
        //     <ScrollView style = { styles.ScrollView }>
        //         <Text style = { styles.heading }>
        //             Change Password
        //         </Text>
        //         <View style = { styles.formView }>
        //             <Text style = { styles.formHeading }>Old password: </Text>
        //             <TextInput style = { styles.textInput } value = { oldPassword } onChangeText = {(text) => setOldPassword(text)}/>
        //             <Text style = { styles.formHeading }>New password: </Text>
        //             <TextInput style = { styles.textInput } value = {newPassword} onChangeText = {(text) => setNewPassword(text)}/>
        //             <Text style = { styles.formHeading }>Confirm password: </Text>
        //             <TextInput style = {styles.textInput} value = {confirmPassword} onChangeText = {(text) => setConfirmPassword(text)}/>
        //             <TouchableOpacity style = { styles.button } onPress = { checkAndUpdatePassword }>
        //                 <Text style = { styles.buttonText }> Save password </Text>
        //             </TouchableOpacity>
        //         </View>
            // </ScrollView>
        // </View>
    )
}

const styles = StyleSheet.create({
    mainView : {
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        backgroundColor:'#fff'
    },
    topView:{
        width: '100%',
        height: '15%', 
        display:'flex',
        justifyContent:'center',
        alignItems:'center'  
    },
    imageStyle:{
        width:'100%',
        resizeMode:'contain'
    },
    heading:{
        color:'#808080', 
        fontSize:30,
        textAlign:'center',
        fontWeight : "bold"
    },
    formView : {
        display : "flex",
        flexDirection : "column",
        width : "100%",
        marginTop : 70
    },
    formHeading : {
        fontWeight : "bold",
        marginTop : 10,
        textAlign : "left",
        width : "100%",
        marginLeft : "6%",
    },
    textInput : {
        width : "90%",
        borderWidth : 1,
        borderColor : "#808080",
        height : 53,
        borderRadius : 20,
        paddingLeft : 10,
        marginTop : 10,
        color : "#000",
        marginLeft : "5%",
    },
    button : {
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
    buttonText : {
        fontWeight : "bold",
        color: '#E3E3E3',
        fontSize : 18
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
    ErrorMessage: {
        alignSelf:'center',
        color:'red',
    },
})
export default ChangePassword