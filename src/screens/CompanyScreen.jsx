import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useCallback, useEffect, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Indicator from '../components/Indicator';
import useBleContext from '../ble/useBLE';


const CompanyScreen = ({navigation}) => {
    const {API_URL} = useBleContext();
    const [isActive, setIsActive] = useState(true);
    const [companies, setCompanies] = useState(null);
    const FetchCompanies = async (token) => {
            await axios.post(API_URL + "Company/Get",{}, 
            {
                headers:{
                    'Authorization': String(token).replace(/['"]+/g, ''),
                    'Content-Type' : 'application/json'
                }
            }
            ).then((response) => {
                setCompanies(response.data);
            }).catch((error) => {
                Alert.alert("Error", "Something went wrong");
            })
           trigger("notificationSuccess", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
    }
    useEffect(() => {
        AsyncStorage.getItem("@token").then((token) => {
            FetchCompanies(token)
    })
    }, [])

    const goToConstr = (id) => {
        console.log("id", id)
        trigger("impactLight", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
        navigation.navigate("Construction", {id: id})
     }
    return(
        <ScrollView scrollEnabled={true} style={styles.scrollView}>
            <Indicator isActive={isActive} />
            <View style={styles.container}>
            {companies && companies.map((company) => {
                return(
                    <Pressable key={company.compId} style={styles.button} onPress={() => goToConstr(company.compId)}>
                            <Text style={styles.text}>{company.compName}</Text>
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
export default CompanyScreen;