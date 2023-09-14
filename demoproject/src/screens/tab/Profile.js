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


const Profile = ({ navigation }) => {
    const [userData, setUserData] = useState('')

    useEffect(() => {
        getUserDetail()
    }, [])


    async function getUserDetail() {
        try {
            const jsonValue = await AsyncStorage.getItem('USERINFO');
            if (jsonValue != null) {
                let parsedVal = JSON.parse(jsonValue)
                console.log("Value from async store : ", parsedVal);
                setUserData(parsedVal)
            }
        } catch (e) {
            console.log("Unable to read value from async store : ", e);
        }
    }


    async function clearUserInfo() {
        try {
            await AsyncStorage.setItem('USERINFO', "");
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        } catch (e) {
            console.log("Unable to save value");
        }
    }


    return (
        <>
            <StatusBar
                backgroundColor="transparent"
            />

            <SafeAreaView style={{ backgroundColor: 'black' }} />
            <View style={{ flex: 1, }}>


                <View style={styles.bodyView}>
                    <View style={styles.topHeader}>
                        <Text style={styles.titletxt}>Profile</Text>
                    </View>

                    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={styles.headerTxt}>Name : </Text>
                            <Text style={styles.txt}>{userData?.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.headerTxt}>Email : </Text>
                            <Text style={styles.txt}>{userData?.email}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => clearUserInfo()}
                        activeOpacity={0.7}
                        style={[styles.uploadBtn]}>
                        <Text style={styles.btnTxt}>Logout</Text>
                    </TouchableOpacity>




                </View>

            </View >
        </>
    );

}

export default Profile;

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
    headerTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black'
    },
    txt: {
        fontSize: 15,
        fontWeight: '500',
        color: 'black'
    },
    uploadBtn: {
        borderRadius: 16,
        backgroundColor: '#BA0432',
        height: 50,
        width: "60%",
        alignItems: 'center',
        justifyContent: "center",
        marginVertical: 10,
        alignSelf: 'center',
        marginBottom: 100
    },
    btnTxt: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white'
    },

});
