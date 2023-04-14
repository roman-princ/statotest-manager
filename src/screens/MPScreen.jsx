import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useCallback, useEffect, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { Button } from 'react-native-paper';
import Indicator from '../components/Indicator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useBleContext from '../ble/useBLE';

const MPScreen = ({route, navigation}) => {
    const [isActive, setIsActive] = useState(true);
    const {API_URL} = useBleContext();
    const [MPs, setMPs] = useState(null);
    const FetchCompanies = async (token) => {
            await axios.post(API_URL + "MP/get",{
                compId: route.params?.compId,
                consId: route.params?.consId
            }, 
            {
                headers:{
                    'Authorization': String(token).replace(/['"]+/g, ''),
                    'Content-Type' : 'application/json'
                }
            }
            ).then((response) => {
                setMPs(response.data);
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

    const goToDevice = (MP) => {
        trigger("impactLight", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
        navigation.navigate("DeviceInfo", {consId: route.params.conId, compId: route.params.compId, MP: MP})
    }
    return(
        <ScrollView scrollEnabled={true} style={styles.scrollView}>
            <View style={styles.container}>
            {MPs !== null ? MPs.map((MP) => {
                return(
                    <Pressable key={MP.mpId} style={styles.button} onPress={() => goToDevice(MP)}>
                        <Text style={styles.text}>{MP.mpName}</Text>
                        <Icon name="navigate-next" size={30} color="#fff" />
                    </Pressable>
                )
            }): <Indicator active={true}/>}
        </View>
        </ScrollView>
        
    )
    
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        backgroundColor: '#252526',
        height: '100%',
    },
    button: {
        backgroundColor: '#8b0000',
        color: '#fff',
        width: "90%",
        height: "auto",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 20,
        padding: 15,
        width: '90%',
        textAlign: 'center',
        fontFamily: "Poppins-Medium"
    },
    scrollView: {
        backgroundColor: '#252526',
        height: '100%',
    }
});
export default MPScreen;