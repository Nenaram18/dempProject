import React, { useState, useEffect, useRef } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Animated,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    Alert,
    TextInput,
    PermissionsAndroid,
    Image,
} from 'react-native';

import ProgressLoader from 'rn-progress-loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import ImageCropPicker from 'react-native-image-crop-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ApiCaller from '../../api/ApiCaller';



const Photos = ({ navigation }) => {
    const [imagePath, setImagePath] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [authToken, setAuthToken] = useState()

    function openImageCameraPicker() {
        ImageCropPicker.openCamera({ width: 400, height: 400, cropping: true }).then(
            image => {
                if (image?.path?.length > 0) {
                    Platform.OS == 'android'
                        ?
                        setImagePath(image?.path)
                        :
                        null
                } else {
                    console.log('Camera Image Path Not Found');
                }
            },
        );
    }


    const openImageGalleryPicker_android = async () => {
        try {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );

            if (granted || (Platform.Version >= 33 && Platform.OS == 'android')) {
                launchImageLibrary(
                    { selectionLimit: 1, mediaType: 'photo' },
                    imageData => {

                        console.log("Image form gallery path : ", imageData?.assets[0]?.uri);
                        setImagePath(imageData?.assets[0]?.uri)
                    }
                );
            } else {

                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        {
                            title: 'External Storage Permission',
                            message: 'This app needs access to your storage to upload picture.',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        },
                    );

                } catch (err) {
                    console.warn(err);
                }

            }
        } catch (err) {
            Alert.alert('Error', 'Unable to access device storage.');
        }
    };


    useEffect(() => {
        getUserDetail()
    }, [])


    async function getUserDetail() {
        try {
            const jsonValue = await AsyncStorage.getItem('USERINFO');
            if (jsonValue != null) {
                let parsedVal = JSON.parse(jsonValue)
                setAuthToken(parsedVal?.auth_token)
            }
        } catch (e) {
            console.log("Unable to read value from async store : ", e);
        }
    }


    const uploadImage = async (imageUri) => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append('tags', 'plants');
            formData.append('image', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'myImage.jpg',
            });

            const response = await axios.post('https://genuinemark.org/piccollect/picture/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Token': authToken,
                },
            });
            setIsLoading(false)
            if (response?.status == 200) {
                console.log('Image uploaded successfully :', response?.data);
                Alert.alert("Success", response?.data?.message)
            } else {
                console.log('Image uploaded fail :', response?.data);
                Alert.alert("Error!", "Unable to upload Image.")
            }

        } catch (error) {
            setIsLoading(false)
            console.error('Error uploading image:', error);
        }
    };



    return (
        <>
            <StatusBar
                backgroundColor="transparent"
            />
            <ProgressLoader
                visible={isLoading}
                isHUD={false}
                hudColor={'white'}
                color={'white'}
                isModal={true}
            />
            <SafeAreaView style={{ backgroundColor: 'black' }} />
            <View style={{ flex: 1, }}>


                <View style={styles.bodyView}>
                    <View style={styles.topHeader}>
                        <Text style={styles.titletxt}>Upload Image</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                        <View style={styles.ImageBox}>

                            <Text style={{ color: '#00000060', position: 'absolute', zIndex: 0, }}>Image here</Text>

                            {
                                imagePath.length != 0
                                    ?
                                    <Image
                                        source={{ uri: imagePath }}
                                        style={{ height: '100%', width: '100%' }}
                                        resizeMode="cover"
                                    />
                                    :
                                    null
                            }


                        </View>


                    </View>

                    <View style={{ height: 100, width: "100%", alignItems: 'center', justifyContent: 'center', }}>
                        {
                            imagePath.length != 0
                                ?
                                <TouchableOpacity
                                    onPress={() => uploadImage(imagePath)}
                                    activeOpacity={0.7}
                                    style={[styles.uploadBtn]}>
                                    <Text style={styles.btnTxt}>UPLOAD IMAGE</Text>
                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => openImageCameraPicker()}
                            activeOpacity={0.7}
                            style={[styles.btnView, { marginRight: 20 }]}>
                            <Text style={styles.btnTxt}>CAMERA</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => openImageGalleryPicker_android()}
                            activeOpacity={0.7}
                            style={styles.btnView}>
                            <Text style={styles.btnTxt}>GALLERY</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View >
        </>
    );

}

export default Photos;

const styles = StyleSheet.create({
    bodyView: {
        flex: 1,
        backgroundColor: 'white',
    },


    titletxt: {
        fontSize: 18,
        fontWeight: '800',
        color: 'white'
    },
    topHeader: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        paddingTop: StatusBar.currentHeight + 5,
        paddingBottom: 15
    },
    btnView: {
        borderRadius: 16,
        backgroundColor: '#BA0432',
        height: 50,
        width: 100,
        alignItems: 'center',
        justifyContent: "center",
    },
    btnTxt: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        marginBottom: 100
    },
    ImageBox: {
        backgroundColor: '#00000010',
        height: 300,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    uploadBtn: {
        borderRadius: 16,
        backgroundColor: '#BA0432',
        height: 50,
        width: "60%",
        alignItems: 'center',
        justifyContent: "center",
        marginVertical: 10,
        alignSelf: 'center'
    }
});
