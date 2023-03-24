import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, RefreshControl, Animated, ScrollView} from 'react-native';
import useBleContext from "../ble/useBLE";
import high from "../../assets/images/high.png"
import mid from "../../assets/images/mid.png"
import low from "../../assets/images/low.png"
import styles from '../../assets/style/styles.jsx';
import Indicator from '../components/Indicator';

const ScanningScreen = ({navigation}) => {
    const {currentDevice, scanForDevices, requestPermission, devices, connectToDevice, startStreamingData, stopAndStartScan} = useBleContext();
    const [isActive, setIsActive] = useState(false);
    const [IndicatorIsActive, setIndicatorIsActive] = useState(false);
    const rssiConverter = (rssi) =>{
        if(rssi > -50){
            return high;
        }
        else if(rssi > -70){
            return mid;
        }
        else{
            return low;
        }

    }


    useEffect(() => {
        requestPermission((result) => {
            if(result) {
                scanForDevices();
            }
        });
    }, []);

    const connectAndNavigateToDevice = useCallback(async (device) => { 
            setIndicatorIsActive(true);
            await connectToDevice(device).then(() => {
                navigation.navigate("Device");
            })
            setIndicatorIsActive(false);
        }, []);
    

    const onRefresh = useCallback(() => {
        setIsActive(true);
        stopAndStartScan();
        setIsActive(false);
    }, []);

    return(
        <>
        <ScrollView style={{flexGrow: 1, backgroundColor: "#252526"}} refreshControl={
            <RefreshControl refreshing={isActive} onRefresh={onRefresh}/>
        }>
            <View style={style.container}>
                {devices.map((device) => (
                    <Pressable key={device.id} onPress={() => connectAndNavigateToDevice(device)} style={style.deviceItem}>
                        <View>
                            <Text style={style.devName}>{device.name}</Text>
                            <Text style={style.devId}>{device.id}</Text>
                        </View>
                        <View style={style.rssiContainer}>
                            <Image source={rssiConverter(device.rssi)} style={{width: 17, height: 17}} />
                            <Text style={style.rssiValue}>{device.rssi} dbm</Text>
                        </View>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
        <Indicator active={IndicatorIsActive} />
        </>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#252526"
    },
    deviceItem: {
        width: "90%",
        height: 100,
        backgroundColor: "#707070",
        marginVertical: 10,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        borderRadius: 10,
        fontFamily: "Poppins-Medium"
    },
    devName: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 16
    },
    rssiContainer: {
        flexDirection: "column",
        alignItems: "flex-end"
    },
    devId: {
        fontFamily: "Poppins-Medium",
        fontSize: 12,
    },
    rssiValue: {
        fontFamily: "Poppins-Medium",
    }
});
export default ScanningScreen;