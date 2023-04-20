import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useCallback, useEffect, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import useBleContext from '../ble/useBLE';
import dayjs from 'dayjs';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const DeviceInfoScreen = ({route, navigation}) => {
    const {API_URL} = useBleContext();
    const [isActive, setIsActive] = useState(true);
    const [device, setDevice] = useState(null);
    const [desc, setDesc] = useState("");
    const [MP, setMP] = useState(route.params?.MP);
    const FetchCompanies = async (token) => {
            await axios.post(API_URL + "MP/dev/get",{
                compId: route.params?.compId,
                consId: route.params?.consId,
                mpId: route.params?.MP.mpId
            }, 
            {
                headers:{
                    'Authorization': String(token).replace(/['"]+/g, ''),
                    'Content-Type' : 'application/json'
                }
            }
            ).then((response) => {
                axios.post(API_URL + "Device/Get",{
                    devId: response.data[0].devId
                },
                {
                    headers:{
                        'Authorization': String(token).replace(/['"]+/g, ''),
                        'Content-Type' : 'application/json'
                    }
                }
                ).then((response) => {
                    console.log(response.data);
                    setDevice(response.data);
                }).catch((error) => {
                    console.log(JSON.stringify(error));
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Something went wrong",
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                })
            }).catch((error) => {
                console.log(JSON.stringify(error));
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Something went wrong",
                    visibilityTime: 2000,
                    autoHide: true,
                })
            })
            trigger("notificationSuccess", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
        }
    useEffect(() => {
        AsyncStorage.getItem("@token").then((token) => {
            FetchCompanies(token).then(() => {
                navigation.setOptions({title: device.devSn ? "CHESTER " + device.devSn : "Device info"})
            })
        })
        
    }, [])

    const saveMP = async (description) => {
        await AsyncStorage.getItem("@token").then((token) => {
            axios.post(API_URL + "MP/Upd",{
                compId: route.params?.compId,
                mpId: MP.mpId,
                mpDesc: description
            },
            {
                headers:{
                    'Authorization': String(token).replace(/['"]+/g, ''),
                    'Content-Type' : 'application/json'
                }
            }
            ).then((response) => {
                console.log(response.data);

            }).catch((error) => {
                console.log(JSON.stringify(error));
                trigger("notificationError", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
            })
        })
    }

    return(
        <ScrollView scrollEnabled={true} style={styles.scrollView}>
            {device && 
            <>
                    <Text style={styles.bigTitle}>Device info</Text>
                    <View style={styles.container} key={device.devId}>
                        
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Device Name:</Text>
                                <Text style={styles.value}>{device.devName ? device.devName : "Unknown"}</Text>
                            </View>
                            
                        
                            <View style={styles.col}>
                                <Text style={styles.title}>Device Type:</Text>
                                <Text style={styles.value}>{device.devType ? device.devType : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Serial Number:</Text>
                                <Text style={styles.value}>{device.devSn ? device.devSn : "Unknown"}</Text>
                            </View>

                            <View style={styles.col}>
                                <Text style={styles.title}>Description</Text>
                                <Text style={[styles.value, {width: "85%"}]}>{device.devDesc ? device.devDesc : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Status:</Text>
                                <Text style={[styles.value, {color: device.devStatus == "Active" || device.devStatus == "Registered" ? "green" : "red"}]}>{device.devStatus ? device.devStatus : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Battery:</Text>
                                <Text style={[styles.value, {color: device.devBattery <= 51 ? "orange" : "green"}]}>{device.devBattery ? device.devBattery + "%" : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Firmware:</Text>
                                <Text style={styles.value}>{device.firmware ? device.firmware : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Temperature:</Text>
                                <Text style={styles.value}>{device.devTemperature ? device.devTemperature + " °C" : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Last updated:</Text>
                                <Text style={styles.value}>{device.dateTimeLastComm ? dayjs(device.dateTimeLastComm).format("d. MMMM YYYY, HH:MM:ss") : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Humidity:</Text>
                                <Text style={styles.value}>{device.devHumidity ? device.devHumidity : "Unknown"}</Text>
                            </View>
                        </View>
                    </View>


                    <Text style={styles.bigTitle}>Measurement point info</Text>
                    <View style={styles.container}>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Name:</Text>
                                <Text style={styles.value}>{MP.mpName ? MP.mpName : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Description:</Text>
                                <Text style={[styles.value, {width: "85%"}]}>{MP.mpDesc ? MP.mpDesc : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Added:</Text>
                                <Text style={styles.value}>{MP.dateTimeAdd ? dayjs(MP.dateTimeAdd).format("d. MMMM YYYY, HH:MM:ss") : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Updated:</Text>
                                <Text style={styles.value}>{MP.dateTimeUpdate ? dayjs(MP.dateTimeUpdate).format("d. MMMM, HH:MM:ss") : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Latitude:</Text>
                                <Text style={styles.value}>{MP.mpLat ? MP.mpLat : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Longitude:</Text>
                                <Text style={styles.value}>{MP.mpLon ? MP.mpLon : "Unknown"}</Text>
                            </View>
                        </View>
                    </View>
                    </>
        }

    </ScrollView>     
)
    
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: '#252526',
        height: '100%',
        width: "95%",
        flexWrap: "wrap",
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
    },
    col:{
        width: "48%",
        marginBottom: 15,
        flexDirection: "column",
        flexWrap: "wrap",  
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 10,
        borderRadius: 10,
    },
    title: {
        color: '#fff',
        fontSize: 11,
        width: '100%',
        fontFamily: "Poppins-Medium"
    },
    bigTitle: {
        color: '#fff',
        fontSize: 25,
        width: '100%',
        fontFamily: "Poppins-SemiBold",
        marginTop: 20,
        textAlign: "center",
    },

    value:{
        color: '#fff',
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        width: '100%',
        marginBottom: 20
    },
    scrollView: {
        backgroundColor: '#252526',
        height: '100%',
        width: '100%',
    }
});
export default DeviceInfoScreen;