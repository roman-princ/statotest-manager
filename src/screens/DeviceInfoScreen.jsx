import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useCallback, useEffect, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { Button } from 'react-native-paper';
import Indicator from '../components/Indicator';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DeviceInfoScreen = ({route, navigation}) => {
    const [isActive, setIsActive] = useState(true);
    const [devices, setDevices] = useState(null);
    const FetchCompanies = async (token) => {
            await axios.post("https://statotestapi.azurewebsites.net/MP/dev/get",{
                compId: route.params?.compId,
                consId: route.params?.consId,
                mpId: route.params?.mpId
            }, 
            {
                headers:{
                    'Authorization': String(token).replace(/['"]+/g, ''),
                    'Content-Type' : 'application/json'
                }
            }
            ).then((response) => {
                axios.post("https://statotestapi.azurewebsites.net/Device/Get",{
                    compId: route.params?.compId,
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
                    setDevices(response.data);
                }).catch((error) => {
                    console.log(JSON.stringify(error));
                    // Alert.alert("Error", "Something went wrong");
                    // navigation.goBack();
                })
            }).catch((error) => {
                console.log(JSON.stringify(error));
                // Alert.alert("Error", "Something went wrong");
                // navigation.goBack();
            })
            trigger("notificationSuccess", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
        }
    useEffect(() => {
        AsyncStorage.getItem("@token").then((token) => {
            FetchCompanies(token)
    })
    }, [])

    return(
        <ScrollView scrollEnabled={true} style={styles.scrollView}>
            {devices && devices.map((device) => {
                return(
                    <View style={styles.container} key={device.devId}>
                        <Text style={styles.title}>Device Name:</Text>
                        <Text style={styles.value}>{device.devName ? device.devName : "Unknown"}</Text>

                        <Text style={styles.title}>Device Type:</Text>
                        <Text style={styles.value}>{device.devType ? device.devType : "Unknown"}</Text>

                        <Text style={styles.title}>Serial Number:</Text>
                        <Text style={styles.value}>{device.devSn ? device.devSn : "Unknown"}</Text>

                        <Text style={styles.title}>Status:</Text>
                        <Text style={[styles.value, {color: device.devStatus == "Active" ? "green" : "red"}]}>{device.devStatus ? device.devStatus : "Unknown"}</Text>

                        <Text style={styles.title}>Password:</Text>
                        <Text style={styles.value}>{device.devPass ? device.devPass : "Unknown"}</Text>
                    </View>
                )
            })}
        {/* {console.log(devices)} */}
        </ScrollView>
        
    )
    
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: '#252526',
        height: '100%',
        margin: 20
    },
    title: {
        color: '#fff',
        fontSize: 15,
        width: '100%',
        fontFamily: "Poppins-Medium"
    },
    value:{
        color: '#fff',
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
        width: '100%',
        marginBottom: 20
    },
    scrollView: {
        backgroundColor: '#252526',
        height: '100%',
    }
});
export default DeviceInfoScreen;