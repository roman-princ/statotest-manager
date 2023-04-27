import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useEffect, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Indicator from '../components/Indicator';
import useBleContext from '../ble/useBLE';
import apiClientContext from '../api/apiClient';


const CompanyScreen = ({navigation}) => {
    const {fetchCompanies, companies, isActive} = apiClientContext();
    useEffect(() => {
        fetchCompanies()
    }, [])

    const goToConstr = (id) => {
        trigger("impactLight", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
        navigation.navigate("Construction", {id: id})
     }
    return(
        <>
        <Indicator isActive={isActive} />
            <ScrollView scrollEnabled={true} style={styles.scrollView}>
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
        </>
        
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