import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Animated} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera, CameraType } from 'expo-camera';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import pickImage from './gallery';
import { ip, port } from './global.js'
import navigationOps from './Screens/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CameraScreen = ({ navigation,route }) => {
    // const { getAllItems } = route.params;
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);``
    const flashTextOpacity = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null)
            setImage(data.uri);
        }
    }

    const saveImage = async () => {
        if (image) {
            try {
                setLoading(true);
                const data = await AsyncStorage.getItem('isLoggedIn')
                if (data) {
                    if (data === 'true') {
                        const token = await AsyncStorage.getItem('token');
                        const response = await axios.post(`http://${ip}:${port}/userdata`, { token: token })

                        console.log(response.data.data);

                        await MediaLibrary.createAssetAsync(image);
                        // alert('Picture saved!')
                        const formData = new FormData();

                        formData.append("image", {
                            uri: image,
                            type: 'image/jpeg',
                            name: 'test.jpeg',
                        });


                        // const resultFromMLServer = await axios.post(
                        //     `http://192.168.175.81:5001/upload-item`,
                        //     formData,
                        //     {
                        //         headers: { "Content-Type": "multipart/form-data" }
                        //     }
                        // );  
                        // console.log(resultFromMLServer.data);

                        formData.append("currentUser", JSON.stringify(response.data.data));
                        // formData.append("Tags",JSON.stringify(resultFromMLServer.data.message));
                        const result = await axios.post(
                            `http://${ip}:${port}/upload-image`,
                            formData,
                            {
                                headers: { "Content-Type": "multipart/form-data" }
                            }
                        );

                        console.log(result);
                        setImage(null);
                    }
                    else {
                        
                        console.log(result.data.message);
                        // setImage(null);
                    }   

                }
                else{
                    console.log("Fatal Error: User not logged In");
                    return;
                }
                setLoading(false);
                navigationOps.goToWardrobe(navigation)
            }
            catch (e) {
                setLoading(false);
                console.log(e)
            }
        }
    }

    const handleFlashPress = () => {
        setFlash(
            flash === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
        );
        fadeInFadeOut();
    }

    const fadeInFadeOut = () => {
        Animated.sequence([
            Animated.timing(flashTextOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(flashTextOpacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    };

    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Image
                        source={require('./assets/green-loading.gif')}
                        style={styles.loadingGif}
                    />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.upperBox}>
                        <View style={styles.flashBox}>
                            <Animated.Text style={[styles.flashText, { opacity: flashTextOpacity }]}>{flash === Camera.Constants.FlashMode.off ? 'Flash Off' : 'Flash On'}</Animated.Text>
                        </View>
                        <View style={styles.flashBox}>
                            <TouchableOpacity
                                title=""
                                activeOpacity={0.8}
                                onPress={handleFlashPress}>
                                <Ionicons name="flash-outline" size={24} color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fcba03'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.cameraContainer}>
                        {!image ? <Camera
                            ref={ref => setCamera(ref)}
                            style={styles.fixedRatio}
                            type={type}
                            flashMode={flash}
                            ratio={'1:1'} />
                            :
                            <Image source={{ uri: image }} style={styles.fixedRatio} />}
                    </View>
                    {image ?
                        <View style={styles.bottomBox}>
                            <View style={styles.controlBox}>
                                <TouchableOpacity
                                    title="Re-take"
                                    style={styles.postpicButton}
                                    activeOpacity={0.8}
                                    onPress={() => setImage(null)}>
                                    <AntDesign name="reload1" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.controlBox}>
                                <TouchableOpacity
                                    title=""
                                    style={styles.postpicButton}
                                    activeOpacity={0.8}
                                    onPress={saveImage}>
                                    <AntDesign name="check" size={28} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={styles.bottomBox}>
                            <View style={styles.controlBox}>
                                <TouchableOpacity
                                    title=""
                                    style={styles.flipButton}
                                    activeOpacity={0.8}
                                    onPress={() => pickImage(setImage)}>
                                    <MaterialCommunityIcons name="image-multiple-outline" size={24} color="white" />
                                </TouchableOpacity>

                            </View>
                            <View style={styles.controlBox}>
                                <TouchableOpacity title="" style={styles.clickButton} onPress={takePicture} />
                            </View>
                            <View style={styles.controlBox}>
                                <TouchableOpacity
                                    title=""
                                    style={styles.flipButton}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setType(
                                            type === Camera.Constants.Type.back
                                                ? Camera.Constants.Type.front
                                                : Camera.Constants.Type.back
                                        );
                                    }}>
                                    <AntDesign name="sync" size={20} color="white" />
                                </TouchableOpacity>

                            </View>
                        </View>}
                </View>)}
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
        width: '100%',
    },
    upperBox: {
        flex: 0.2,
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 30,
        flexDirection: 'row',
    },
    bottomBox: {
        flex: 0.35,
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },
    flipButton: {
        width: 42,
        height: 42,
        backgroundColor: '#2f2f2f',
        color: '#ffffff',
        borderRadius: 50,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postpicButton: {
        width: 55,
        height: 55,
        backgroundColor: '#2f2f2f',
        color: '#ffffff',
        borderRadius: 50,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clickButton: {
        backgroundColor: 'white',
        width: 65,
        height: 65,
        borderColor: '#2f2f2f',
        borderWidth: 0,
        color: '#ffffff',
        borderRadius: 50,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    flashBox: {
        display: 'flex',
        flexDirection: 'row', loadingContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        alignItems: 'center',
    },
    flashText: {
        color: 'white',
        marginRight: 20,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: 'rgb(33,36,45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingGif: {
        width: 400,
        height: 400,
    },
});

export default CameraScreen;
