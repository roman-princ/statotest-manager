import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useCallback, useEffect, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import Indicator from '../components/Indicator';


const CompanyScreen = ({navigation}) => {
    const [isActive, setIsActive] = useState(true);
    const [companies, setCompanies] = useState(null);
    const FetchCompanies = async (token) => {
            await axios.post("https://statotestapi.azurewebsites.net/Company/Get",{}, 
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
            setIsActive(false);
    }
    useEffect(() => {
        AsyncStorage.getItem("@token").then((token) => {
            FetchCompanies(token)
    })
    }, [])
    return(
        <ScrollView scrollEnabled={true} style={styles.scrollView}>
            <View style={styles.container}>
            {companies && companies.map((company) => {
                return(
                    <Pressable key={company.id} style={styles.button}>
                        <Text style={styles.text}>{company.compName}</Text>
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
    },
    text: {
        color: '#fff',
        fontSize: 20,
        padding: 15,
        textAlign: 'center',
        fontFamily: "Poppins-Medium"
    },
    scrollView: {
        backgroundColor: '#252526',
        height: '100%',
    }
});
export default CompanyScreen;