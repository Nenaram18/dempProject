import React, { useState, useEffect, useRef } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    TextInput,
    Image,
    FlatList
} from 'react-native';

import ProgressLoader from 'rn-progress-loader';
import ApiCaller from '../../api/ApiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TradeList = () => {
    const [selectedToggle, setSelectedToggle] = useState(1)
    const [searchInput, setSearchInput] = useState()
    const [apiData, setApiData] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    async function getTradeListApi(status) {
        setIsLoading(true);
        let params = {
            filters: status,
        }
        ApiCaller.callTradeListApi(params, (statuscode, response) => {
            if (response?.status == 200) {
                console.log("TRADE LIST API SUCCESS : ", JSON.stringify(response?.data));
                setApiData(response?.data)
            } else {
                console.log("TRADE LIST API FAIL : ", JSON.stringify(response));
                Alert.alert("Error", response?.message)
            }
            setIsLoading(false);
        })
    }



    useEffect(() => {
        getTradeListApi("ongoing")
    }, [])


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
            <View>

                <View style={styles.topHeaderView}>
                    <View style={{ width: 35 }} />
                    <Text style={styles.titleTxt}>Trade Recommendations</Text>
                    <Image
                        source={require('../../assets/images/filter.png')}
                        style={{
                            height: 35, width: 35
                        }}
                    />
                </View>

                {/* toggle view  */}
                <View style={styles.toggleView}>
                    <TouchableOpacity onPress={() => { setSelectedToggle(1), getTradeListApi("ongoing") }} style={[styles.toggleBtn, { backgroundColor: selectedToggle == 1 ? '#00C8BC' : "white" }]}>
                        <Text style={[styles.toggleBtnTxt, { color: selectedToggle == 1 ? 'white' : "black" }]}>
                            Ongoing Trades
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setSelectedToggle(2), getTradeListApi("expired") }} style={[styles.toggleBtn, { backgroundColor: selectedToggle == 2 ? '#00C8BC' : "white" }]}>
                        <Text style={[styles.toggleBtnTxt, { color: selectedToggle == 2 ? 'white' : "black" }]}>
                            Expired Trades
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* search view  */}
                <View style={styles.searchView}>
                    <TextInput
                        value={searchInput}
                        placeholder='Search by stock or mentor name'
                        placeholderTextColor={"#545454"}
                        style={styles.inputTxt}
                        onChangeText={(val) => setSearchInput(val)}
                    />
                    <Image
                        source={require("../../assets/images/search.png")}
                        style={{
                            height: 20,
                            width: 20
                        }}
                    />
                </View>

                {
                    apiData != []
                        ?
                        <FlatList
                            data={apiData}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.cellView}>
                                        <View style={styles.cellTopView}>
                                            <Text style={styles.cellTopTxt}>XYZ trade</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.cellTopDateTxt}>25-5-2022</Text>
                                                <Image
                                                    source={require('../../assets/images/rightarrow.png')}
                                                    style={{ height: 20, width: 20, marginLeft: 6 }}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.rowView}>
                                            <View>
                                                <View>
                                                    <Text style={styles.cellTitleTxt}>Type:</Text>
                                                    <Text numberOfLines={1} style={styles.cellSubTitleTxt}>{item?.type}</Text>
                                                </View>

                                                <View>
                                                    <Text style={styles.cellTitleTxt}>Stop Loss:</Text>
                                                    <Text numberOfLines={1} style={styles.cellSubTitleTxt}>{item?.stop_loss_price}</Text>
                                                </View>

                                                <View>
                                                    <Text style={styles.cellTitleTxt}>Status:</Text>
                                                    <View style={[styles.postedByView, { backgroundColor: item?.status == "Close" ? '#D337371A' : "#00BDB11A" }]}>
                                                        <Text numberOfLines={1} style={[styles.cellSubTitleTxt, { marginBottom: 0, color: item?.status == "Close" ? '#D33737' : "#00C8BC" }]}>{item?.status}</Text>
                                                    </View>
                                                </View>
                                            </View>


                                            <View>
                                                <View>
                                                    <Text style={styles.cellTitleTxt}>Entry:</Text>
                                                    <Text numberOfLines={1} style={styles.cellSubTitleTxt}>{item?.entry_price}</Text>
                                                </View>

                                                <View style={{ width: '85%' }}>
                                                    <Text style={styles.cellTitleTxt}>Stock Name:</Text>
                                                    <Text adjustsFontSizeToFit numberOfLines={2} style={[styles.cellSubTitleTxt,]}>{item?.stock}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.cellTitleTxt}>Posted by:</Text>

                                                    <View style={[styles.postedByView]}>
                                                        <Text numberOfLines={1} style={[styles.cellSubTitleTxt, { marginBottom: 0, color: '#00C8BC' }]}>{item?.user?.name}</Text>
                                                    </View>
                                                </View>

                                            </View>

                                            <View>
                                                <View>
                                                    <Text style={styles.cellTitleTxt}>Exit:</Text>
                                                    <Text numberOfLines={1} style={styles.cellSubTitleTxt}>{item?.exit_price}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.cellTitleTxt}>Action:</Text>
                                                    <Text numberOfLines={1} style={styles.cellSubTitleTxt}>{item?.action}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.cellTitleTxt}></Text>
                                                    <Text style={styles.cellSubTitleTxt}></Text>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                        :
                        null
                }




            </View>
        </>
    )
}

export default TradeList

const styles = StyleSheet.create({
    topHeaderView: {
        height: 90,
        width: "100%",
        backgroundColor: '#00C8BC',
        borderBottomRightRadius: 22,
        borderBottomLeftRadius: 22,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 20,
        paddingTop: 12
    },
    titleTxt: {
        fontSize: 18,
        color: 'white',
        fontWeight: '700'
    },
    toggleView: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: 'white',
        height: 45,
        padding: 4,
        marginBottom: 15,
        shadowColor: '#00000090',
        elevation: 10,
        shadowRadius: 5
    },
    toggleBtn: {
        borderRadius: 30,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    toggleBtnTxt: {
        fontSize: 14,
        fontWeight: '700'
    },
    searchView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#00000050',
        justifyContent: 'space-between',
        backgroundColor: '#F6F6F6',
        marginBottom: 12,
        width: '90%',
        alignSelf: 'center'
    },
    inputTxt: {
        flex: 1,
        marginRight: 8,
        fontSize: 16,
        color: 'black'
    },
    cellView: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: 16,
        backgroundColor: 'white',
        overflow: 'hidden',
        shadowColor: '#00000090',
        elevation: 6,
        shadowRadius: 5,
        paddingBottom: 14
    },
    cellTopView: {
        backgroundColor: '#00C8BC',
        height: 32,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        marginBottom: 8
    },
    cellTopTxt: {
        fontSize: 15,
        color: 'white',
        fontWeight: '700',

    },
    cellTopDateTxt: {
        fontSize: 12,
        color: 'white',
        fontWeight: '600',
    },
    cellTitleTxt: {
        fontSize: 12,
        color: '#888888',
        fontWeight: '600',
    },
    cellSubTitleTxt: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '600',
        marginBottom: 18,
        // backgroundColor: 'red',


    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        justifyContent: 'space-between',
        flex: 1,
    },
    postedByView: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 30,
        backgroundColor: '#00C8BC1A'
    }
})