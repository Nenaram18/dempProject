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

const Register = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef1 = useRef();
    const inputRef2 = useRef();
    const inputRef3 = useRef();


    function encryptPassword(pass) {
        const md5 = MD5(pass)?.toString();
        const sha256 = SHA256(md5)?.toString();
        return sha256;
    }


    async function RegisterApi() {
        setIsLoading(true);
        let params = {
            name: userName,
            email: email,
            password: password
            // password: encryptPassword(password)
        }
        ApiCaller.callRegisterApi(params, (statuscode, response) => {
            if (statuscode == 200) {
                console.log("REGISTER API SUCCESS : ", JSON.stringify(response));
                Alert.alert("Success!", "Account created successfully")
                setUserName("")
                setEmail("")
                setPassword("")
                setConfirmPassword("")
            } else {
                console.log("REGISTER API FAIL : ", JSON.stringify(response));
                Alert.alert("Error", "Unable to create account")
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
            <SafeAreaView style={{ backgroundColor: "black" }} />
            <View style={{ flex: 1, backgroundColor: "black" }}>

                <View style={styles.welcomeView}>
                    <Text style={styles.signinTxt}>Sign Up</Text>
                    <Text style={styles.welcometxt}>
                        Let's create your account!
                    </Text>
                </View>

                <View style={styles.bodyView}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.titletxt}>UserName</Text>
                        <View style={[styles.inputView]}>
                            <TextInput
                                value={userName}
                                placeholder={'Enter your userName'}
                                placeholderTextColor={'#00000040'}
                                autoCapitalize='none'
                                returnKeyType={'next'}
                                onSubmitEditing={() => inputRef1.current.focus()}
                                onChangeText={val => { setUserName(val.replace(/\s/g, '')) }}
                                style={[styles.input]}
                            />
                        </View>


                        <Text style={styles.titletxt}>Email</Text>
                        <View style={[styles.inputView]}>
                            <TextInput
                                value={email}
                                placeholder={'Enter your email'}
                                placeholderTextColor={'#00000040'}
                                autoCapitalize='none'
                                ref={inputRef1}
                                returnKeyType={'next'}
                                keyboardType={'email-address'}
                                onSubmitEditing={() => inputRef2.current.focus()}
                                onChangeText={val => { setEmail(val.replace(/\s/g, '')) }}
                                style={[styles.input]}
                            />
                        </View>

                        <Text style={styles.titletxt}>Password</Text>
                        <View style={[styles.inputView]}>
                            <TextInput
                                value={password}
                                ref={inputRef2}
                                placeholder={'Enter your password'}
                                placeholderTextColor={'#00000040'}
                                returnKeyType={'next'}
                                secureTextEntry={true}
                                onSubmitEditing={() => inputRef3.current.focus()}
                                onChangeText={val => { setPassword(val.replace(/\s/g, '')) }}
                                style={[styles.input]}
                            />

                        </View>
                        <Text style={styles.titletxt}>Confirm Password</Text>
                        <View style={[styles.inputView]}>
                            <TextInput
                                value={confirmPassword}
                                placeholder={'Confirm your password'}
                                placeholderTextColor={'#00000040'}
                                ref={inputRef3}
                                returnKeyType={'done'}
                                secureTextEntry={true}
                                onChangeText={val => { setConfirmPassword(val.replace(/\s/g, '')) }}
                                style={[styles.input]}
                            />

                        </View>



                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => handleRegister()}
                            style={[styles.bottonView, {
                                backgroundColor: userName.length > 2 && email?.length > 2 && password?.length > 2 && confirmPassword?.length > 2 ? "#BA0432" : "#00000040",
                            }]}>
                            <Text
                                style={[
                                    styles.buttonTxt,
                                    {
                                        color: userName.length > 2 && email?.length > 2 && password?.length > 2 && confirmPassword?.length > 2 ? "white" : "black",
                                    },
                                ]}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.bottomTxt}>
                            Already have an account?{' '}
                            <Text
                                onPress={() => {
                                    setUserName("")
                                    setEmail('');
                                    setPassword('');
                                    navigation.goBack();
                                }}
                                style={{
                                    color: 'black',
                                    fontWeight: '800'
                                }}>
                                Sign In
                            </Text>
                        </Text>
                    </ScrollView>
                </View>

            </View>
        </>
    );

    function handleRegister() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (userName.length == 0) {
            Alert.alert("Error", "Enter user name.")
        } else if (email.length == 0) {
            Alert.alert("Error", "Enter email")
        } else if (password?.length == 0) {
            Alert.alert("Error", "Enter password")
        } else if (confirmPassword?.length < 0) {
            Alert.alert("Error", "Enter confirm password")
        } else if (password != confirmPassword) {
            Alert.alert("Error", "Password does not match")
        } else if (!emailRegex.test(email)) {
            Alert.alert("Error", "Enter valid email")
        } else {

            if (userName?.length > 3 && email?.length > 3 && password?.length > 3 && confirmPassword?.length > 3) {
                NetInfo.fetch().then((state) => {
                    if (state.isConnected) {
                        RegisterApi();
                    } else {
                        Alert.alert("Error", "Check your internet connection")
                    }
                })
            } else {
                Alert.alert("Error", "Enter your email and password.")
            }


        }


    }

}

export default Register;

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
        height: 140,
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
