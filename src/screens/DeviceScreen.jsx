import { useEffect } from 'react';
import {View, Text, StyleSheet, Alert, Pressable, ScrollView} from 'react-native';
import useBleContext from '../ble/useBLE';
import ButtonDarkRed from '../components/ButtonDarkRed';
import FwScreen from './FwScreen';

const DeviceScreen = ({navigation}) => {
    const {currentDevice, ChesterData} = useBleContext();
    useEffect(() => {
        if (currentDevice){
            navigation.setOptions({title: currentDevice.name});
        }
    }, [currentDevice]);

    

    return(
        <View style={styles.container}>
            <View style={styles.buttons}>
                <ButtonDarkRed text="Measure" args={"stt measure"}/>
                <ButtonDarkRed text="Config" args={"stt config"} />

            <Pressable style={styles.button} onPress={() => navigation.navigate("FwScreen")}>
                <Text style={styles.buttonTitle}>FW Update</Text>
            </Pressable>
            </View>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.text}>{ChesterData}</Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#252526",
    },
    text:{
        fontFamily: "Poppins-Medium",
        fontSize: 15
    },
    buttons: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "95%",
    },
    scrollView: {
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 50,
        width: "90%",
        height: "70%",
        backgroundColor: "#353535",
        padding: 10,
        flexGrow: 0,
    },
        button: {
            alignItems: 'center',
            backgroundColor: '#8B0000',
            borderRadius: 8,
            height: 50,
            width: 100,
            justifyContent: 'center',
          },
          buttonTitle: {
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: '600',
            lineHeight: 22,
            fontFamily: "Poppins-Medium"
            },

});

export default DeviceScreen;