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
} from 'react-native';

import ProgressLoader from 'rn-progress-loader';
import { MD5, SHA256 } from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import ApiCaller from '../../api/ApiCaller';


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef();


    function encryptPassword(pass) {
        const md5 = MD5(pass)?.toString();
        const sha256 = SHA256(md5)?.toString();
        return sha256;
    }


    async function saveUserInfo(val) {
        console.log("Info : ", val);
        try {
            const jsonValue = JSON.stringify(val);
            await AsyncStorage.setItem('USERINFO', jsonValue);
            navigation.reset({ index: 0, routes: [{ name: "TabNavigation" }] });
        } catch (e) {
            console.log("Unable to save value");
        }
    }


    async function LoginApi() {
        setIsLoading(true);
        let params = {
            email: email,
            password: password

        }
        ApiCaller.callLoginApi(params, (statuscode, response) => {
            if (response?.status == 200) {
                // console.log("LOGIN API SUCCESS : ", JSON.stringify(response));
                saveUserInfo(response?.data)
            } else {
                console.log("LOGIN API FAIL : ", JSON.stringify(response));
                Alert.alert("Error", response?.message)
            }
            setIsLoading(false);

        })
    }


    return (
        <>
            <StatusBar
                backgroundColor="transparent"
                barStyle={'light-content'}
                translucent={true}
            />
            <ProgressLoader
                visible={isLoading}
                isHUD={false}
                hudColor={'white'}
                color={'white'}
                isModal={true}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>

                <View style={styles.welcomeView}>
                    <Text style={styles.signinTxt}>Sign In</Text>
                    <Text style={styles.welcometxt}>
                        Hey, welcome back to your account!
                    </Text>
                </View>

                <View style={styles.bodyView}>

                    <Text style={styles.titletxt}>Email</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                            value={email}
                            placeholder={'Enter your email'}
                            autoCapitalize='none'
                            placeholderTextColor={'#00000040'}
                            returnKeyType={'next'}
                            keyboardType={'email-address'}
                            onSubmitEditing={() => inputRef.current.focus()}
                            onChangeText={val => { setEmail(val.replace(/\s/g, '')) }}
                            style={[styles.input]}
                        />
                    </View>

                    <Text style={styles.titletxt}>Password</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                            value={password}
                            ref={inputRef}
                            placeholder={'Enter your password'}
                            placeholderTextColor={'#00000040'}
                            returnKeyType={'done'}
                            secureTextEntry={true}
                            onChangeText={val => { setPassword(val.replace(/\s/g, '')) }}
                            style={[styles.input]}
                        />

                    </View>

                    <Text
                        onPress={() => navigation.navigate('ForgotPassModal')}
                        style={styles.forgetPasTxt}>
                        Forgot Password?
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => handleLogin()}
                        style={[styles.bottonView, {
                            backgroundColor: email?.length > 3 && password?.length > 3 ? "#BA0432" : "#00000040",
                        }]}>
                        <Text
                            style={[
                                styles.buttonTxt,
                                {
                                    color: email?.length > 3 && password?.length > 3 ? "white" : "black",
                                },
                            ]}>
                            Sign In
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.bottomTxt}>
                        Don't have an account?{' '}
                        <Text
                            onPress={() => {
                                setEmail('');
                                setPassword('');
                                navigation.navigate('Register');
                            }}
                            style={{
                                color: 'black',
                                fontWeight: '800'
                            }}>
                            Sign Up
                        </Text>
                    </Text>

                </View>

            </SafeAreaView>
        </>
    );




    function handleLogin() {
        if (email?.length > 3 && password?.length > 3) {
            NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                    LoginApi();
                } else {
                    Alert.alert("Error", "Check your internet connection")
                }
            })
        } else {
            Alert.alert("Error", "Enter your email and password.")
        }
    }

}

export default Login;

const styles = StyleSheet.create({
    bodyView: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    welcomeView: {
        height: 200,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    signinTxt: {
        fontSize: 26,
        color: 'white',
        alignSelf: 'center',
        fontWeight: '800',
        marginBottom: 10
    },
    welcometxt: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
    },
    forgetPasTxt: {
        fontSize: 18,
        alignSelf: 'center',
        marginVertical: 16,
        color: 'black'
    },

    bottomTxt: {
        fontSize: 14,
        alignSelf: 'center',
        marginVertical: 12,
        paddingBottom: Platform.OS == 'android' ? 250 : 0,
        color: 'black'
    },
    bottonView: {
        height: 54,
        width: '100%',
        borderRadius: 10,
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTxt: {
        fontSize: 20,
        fontWeight: '700'
    },
    input: {
        flex: 1,
        color: "black",
        fontSize: 16,
        paddingHorizontal: 12,
    },
    inputView: {
        height: 54,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 8,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
    },
    iconView: {
        height: '100%',
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titletxt: {
        fontSize: 16,
        marginTop: 10,
        marginLeft: 4,
        color: 'black'
    },
});
