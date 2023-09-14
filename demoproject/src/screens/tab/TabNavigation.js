import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    AppState,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Photos from './Photos';
import Profile from './Profile';

const TabNavigation = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    height: 70,
                    borderRadius: 10,
                    backgroundColor: 'black',
                    marginHorizontal: 24,
                    marginBottom:
                        Platform.OS == 'android'
                            ? StatusBar.currentHeight
                            : insets.bottom,
                    justifyContent: 'center',
                    borderTopColor: 'transparent',
                    ...styles.shadow,
                },
            }}>
            <Tab.Screen name="Home" component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <>
                            <View style={{ flex: 1 }} />
                            <View
                                style={[styles.iconView,]}>
                                <Image
                                    source={require('../../assets/images/home.png')}
                                    style={{
                                        height: 25,
                                        width: 25
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }} />
                        </>
                    ),
                }}

            />
            <Tab.Screen name="Photos" component={Photos}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <>
                            <View style={{ flex: 1 }} />
                            <View
                                style={[
                                    styles.iconView,

                                ]}>
                                <Image
                                    source={require('../../assets/images/camera.png')}
                                    style={{
                                        height: 25,
                                        width: 25
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }} />
                        </>
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <>
                            <View style={{ flex: 1 }} />
                            <View
                                style={[
                                    styles.iconView,

                                ]}>
                                <Image
                                    source={require('../../assets/images/setting.png')}
                                    style={{
                                        height: 25,
                                        width: 25
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }} />
                        </>
                    ),
                }}
            />

        </Tab.Navigator>
    )
}

export default TabNavigation

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#00000029',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 7,
        elevation: 5,
    },

    iconView: {
        borderRadius: 30,
        padding: 8,
        justifyContent: 'center',
        backgroundColor: "white"
    },
})