import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useCallback, useEffect, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { Button } from 'react-native-paper';
import Indicator from '../components/Indicator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useBleContext from '../ble/useBLE';

const ConstructionScreen = ({route, navigation}) => {
    //console.log("params", route.params)
    const {API_URL} = useBleContext();
    const [isActive, setIsActive] = useState(true);
    const [constructions, setConstructions] = useState(null);
    const FetchCompanies = async (token) => {
            await axios.post(API_URL + "Constructions/get",{
                compId: route.params?.id
            }, 
            {
                headers:{
                    'Authorization': String(token).replace(/['"]+/g, ''),
                    'Content-Type' : 'application/json'
                }
            }
            ).then((response) => {
                setConstructions(response.data);
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

    const goToMP = (consId) => {
        trigger("impactLight", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
        navigation.navigate("MP", {consId: consId, compId: route.params?.id})
    }
    return(
        <ScrollView scrollEnabled={true} style={styles.scrollView}>
            <View style={styles.container}>
            {constructions && constructions.map((construction) => {
                return(
                    <Pressable key={construction.consId} style={styles.button} onPress={() => goToMP(construction.consId)}>
                        <Text style={styles.text}>{construction.consName}</Text>
                        <Icon name="navigate-next" size={30} color="#fff" />
                    </Pressable>
                )
            })}
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
export default ConstructionScreen;