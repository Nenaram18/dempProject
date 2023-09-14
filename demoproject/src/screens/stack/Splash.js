import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedText = Animated.createAnimatedComponent(Text);

const Splash = ({ navigation }) => {
    const fontSize = useRef(new Animated.Value(20)).current;

    setTimeout(() => {
        getUserDetail()

    }, 2000);

    useEffect(() => {
        increaseFontSize()
    }, [])


    const increaseFontSize = () => {
        Animated.timing(fontSize, {
            toValue: 40,
            duration: 1800,
            useNativeDriver: false,
        }).start();
    };


    async function getUserDetail() {
        try {
            const jsonValue = await AsyncStorage.getItem('USERINFO');
            if (jsonValue != null) {

                navigation.reset({ index: 0, routes: [{ name: "TabNavigation" }] });
                console.log("Value found in async store : ", jsonValue);
            } else {
                console.log("Async store empty");
                navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            }
        } catch (e) {
            console.log("Unable to read value from async store : ", e);
        }
    }




    return (
        <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatedText style={{ fontSize, color: 'white', fontWeight: 'bold' }}>Genefied</AnimatedText>
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({})