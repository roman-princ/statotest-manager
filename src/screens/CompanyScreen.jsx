import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useEffect, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';


const CompanyScreen = ({navigation}) => {
    const [companies, setCompanies] = useState(null);
    useEffect(() => {
        
        AsyncStorage.getItem("@token").then((token) => {
        console.log("Token:", token);
        axios.post("https://statotestapi.azurewebsites.net/Company/Get",{}, {
            headers: {
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            setCompanies(response.data);
        }).catch((error) => {
            console.log(JSON.stringify(error));
        })
    })
    }, [])
    return(
        <View style={styles.container}>
            {companies && companies.map((company) => {
                return(
                    <Pressable>
                        <Text>{console.log(company.name)}</Text>
                        
                    </Pressable>
                )
            })}
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#252526',
    },
    button: {
        backgroundColor: '#8b0000',
        color: '#fff',
        width: 200,
        height: 50,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        fontFamily: "Poppins-Medium",
    },
});
export default CompanyScreen;