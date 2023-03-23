import { useEffect } from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import instance from '../ble/useBLE';

const DeviceScreen = ({navigation}) => {
    // const {device} = route.params;
    console.log(instance.currentDevice);

    return(
        <View style={styles.container}>
            <Text style={styles.text}>cau</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    text:{
        fontFamily: "Poppins-Medium",
        fontSize: 30
    }

});

export default DeviceScreen;