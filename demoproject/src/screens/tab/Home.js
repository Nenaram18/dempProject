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
    FlatList,
} from 'react-native';

import ProgressLoader from 'rn-progress-loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import ImageCropPicker from 'react-native-image-crop-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({ navigation }) => {
    const [arrImages, setArrImages] = useState('')
    const [isLoading, setIsLoading] = useState(false);



    useFocusEffect(
        React.useCallback(() => {
            getUserDetail()
        }, [])
    );

    async function getUserDetail() {
        try {
            const jsonValue = await AsyncStorage.getItem('USERINFO');
            if (jsonValue != null) {
                let parsedVal = JSON.parse(jsonValue)
                console.log("Value from async store : ",);
                getImages(parsedVal?.auth_token)
            }
        } catch (e) {
            console.log("Unable to read value from async store : ", e);
        }
    }



    const getImages = async (token) => {
        setIsLoading(true)
        const response = await axios.get('https://genuinemark.org/piccollect/picture/listAll', {
            headers: {
                'Token': token,
            },
        });
        if (response?.status == 200) {
            console.log('Get image successfully :', response?.data?.data);
            setArrImages(response?.data?.data)
            setIsLoading(false)
        } else {
            setIsLoading(false)
            console.log('Get image fail :', response?.data);
            Alert.alert("Error!", "Unable to get Images.")
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
                        <Text style={styles.titletxt}>Gallery</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        {
                            arrImages.length == 0
                                ?
                                <Text style={{ alignSelf: 'center', color: 'black' }}>No images available.</Text>
                                :
                                <FlatList
                                    data={arrImages}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={styles.cellView}>
                                                <Image
                                                    source={{ uri: item?.file_path }}
                                                    style={{
                                                        height: "100%",
                                                        width: "100%"
                                                    }}
                                                    resizeMode='cover'
                                                />
                                            </View>
                                        )
                                    }}
                                    ListFooterComponent={() => {
                                        return (
                                            <View
                                                style={{ marginBottom: 100 }}
                                            />
                                        );
                                    }}
                                />
                        }

                    </View>


                </View>

            </View >
        </>
    );

}

export default Home;

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
    cellView: {
        height: 200,
        width: '90%',
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 12,
        marginTop: 20
    }
});
