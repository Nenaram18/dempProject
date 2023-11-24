import React, { useState, useEffect, useRef } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    Alert,
    TextInput,
    Image,
} from 'react-native';

import ProgressLoader from 'rn-progress-loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import ApiCaller from '../../api/ApiCaller';
import { CountryPicker } from 'react-native-country-codes-picker';
import Flag from 'react-native-flags';
import DeviceInfo from 'react-native-device-info';

const Login = ({ navigation }) => {
    const [mobileNo, setMobileNo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countryCode, setCountryCode] = useState('+91');
    const [flagImg, setFlagImg] = useState('IN');
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    async function saveLoginToken(val) {
        console.log("Info : ", val);
        try {
            const jsonValue = JSON.stringify(val);
            await AsyncStorage.setItem('AUTHTOKEN', jsonValue);
            navigation.reset({ index: 0, routes: [{ name: "TradeList" }] });
        } catch (e) {
            console.log("Unable to save value");
        }
    }


    async function LoginApi() {
        setIsLoading(true);
        let params = {
            country_code: countryCode,
            // mobile: mobileNo,
            mobile: "9106946953",
            otp: "1234",
            device_id: DeviceInfo.getDeviceId(),
            device_type: Platform.OS == 'android' ? "android" : 'ios'
        }
        ApiCaller.callLoginApi(params, (statuscode, response) => {
            if (response?.status == 200) {
                console.log("LOGIN API SUCCESS : ", JSON.stringify(response?.data?.token));
                saveLoginToken(response?.data?.token)
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
            <SafeAreaView style={{ flex: 1, backgroundColor: '#00C8BC', }}>

                <View style={styles.LogoView}>
                    <Image
                        source={require('../../assets/images/LoginLogo.png')}
                        style={{
                            height: 120, width: 120,
                        }}
                    />
                </View>

                <View style={styles.outerBodyView}>
                    <View style={styles.innerBodyView}>


                        <Text style={styles.titletxt}>Mobile number</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowCountryPicker(true)} style={[styles.inputView, { marginRight: 10, flexDirection: 'row', alignItems: 'center' }]}>
                                <Flag code={flagImg} size={32} />
                                <Text style={styles.countryCodeTxt}>{countryCode}</Text>
                                <Image
                                    source={require('../../assets/images/downarrow.png')}
                                    style={{
                                        marginLeft: 5
                                    }}
                                />
                                <CountryPicker
                                    show={showCountryPicker}
                                    withFlag
                                    // when picker button press you will get the country object with dial code
                                    pickerButtonOnPress={item => {
                                        console.log('item--', item);
                                        setCountryCode(item?.dial_code);
                                        setFlagImg(item?.code);
                                        setShowCountryPicker(false);
                                    }}
                                    style={{
                                        modal: {
                                            height: 400,
                                            backgroundColor: '#00C8BC',
                                        },
                                        countryName: {
                                            color: 'black',
                                        },
                                        dialCode: {
                                            color: 'black',
                                        },
                                        textInput: {
                                            height: 40,
                                            borderRadius: 10,
                                            color: 'black',
                                            backgroundColor: 'white',
                                            fontSize: 16,
                                        },
                                        countryMessageContainer: {
                                            color: 'black',
                                        },
                                    }}
                                    translation="common"
                                />
                            </TouchableOpacity>
                            <View style={[styles.inputView, { flex: 1 }]}>
                                <TextInput
                                    value={mobileNo}
                                    placeholder={'Enter mobile number'}
                                    placeholderTextColor={'#00000040'}
                                    keyboardType={'phone-pad'}
                                    onChangeText={val => { setMobileNo(val.replace(/[^0-9]/g, '')) }}
                                    maxLength={10}
                                    style={[styles.input]}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => handleLogin()}
                            style={styles.bottonView}>
                            <Text style={styles.buttonTxt}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.rowView}>
                            <View style={styles.LineView} />
                            <Text style={styles.withtxt}>With</Text>
                            <View style={styles.LineView} />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={[styles.googleBtn]}>
                            <Image
                                source={require('../../assets/images/google.png')}
                                style={{
                                    height: 45, width: 45
                                }}
                            />
                            <Text style={styles.buttonTxt}>
                                Google
                            </Text>
                            <View style={{ width: 45 }} />
                        </TouchableOpacity>
                    </View>
                </View>

            </SafeAreaView>
        </>
    );




    function handleLogin() {
        if (mobileNo?.length == 10) {
            NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                    LoginApi();
                } else {
                    Alert.alert("Error", "Check your internet connection")
                }
            })
        } else {
            Alert.alert("Error", "Enter valid mobile number.")
        }
    }

}

export default Login;

const styles = StyleSheet.create({
    outerBodyView: {
        flex: 1,
        backgroundColor: '#FFFFFF80',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 8
    },
    innerBodyView: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: 'white',

    },
    LogoView: {
        height: 260,
        backgroundColor: '#00C8BC',
        alignItems: 'center',
        justifyContent: 'center'
    },
    googleBtn: {
        height: 54,
        width: '100%',
        borderRadius: 10,
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#DC4E41",
        flexDirection: 'row'
    },
    bottonView: {
        height: 54,
        width: '100%',
        borderRadius: 10,
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00C8BC'
    },
    buttonTxt: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white'
    },
    input: {
        flex: 1,
        color: "black",
        fontSize: 15,
        paddingHorizontal: 12,
    },
    inputView: {
        height: 54,
        marginTop: 5,
        marginBottom: 8,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBlockColor: '#171717',

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
        fontWeight: '700',
        color: '#00000080'
    },
    rowView: {
        flexDirection: "row",
        alignItems: 'center'
    },
    LineView: {
        height: 1,
        flex: 1,
        backgroundColor: '#171717'
    },
    withtxt: {
        color: '#686868',
        paddingHorizontal: 6,
        fontSize: 15
    },
    countryCodeTxt: {
        color: 'black',
        paddingHorizontal: 6,
        fontSize: 15
    }
});
