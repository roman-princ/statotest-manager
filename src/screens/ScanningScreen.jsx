import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert, ActivityIndicator} from 'react-native';
import useBLE from "../ble/useBLE";
import high from "../../assets/images/high.png"
import mid from "../../assets/images/mid.png"
import low from "../../assets/images/low.png"


const ScanningScreen = ({navigation}) => {
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


    const { requestPermission, scanForDevices, devices, connectToDevice, currentDevice } = useBLE();
    useEffect(() => {
        requestPermission((result) => {
            if(result) {
                scanForDevices();
            }
        });
    }, []);

    const connectAndNavigateToDevice = async (device) => {   
        if(currentDevice) currentDevice.cancelConnection();
        await connectToDevice(device);
        navigation.navigate("Device")
    }

    return(
            <View style={style.container}>
                {devices.map((device) => (
                    <Pressable key={device.id} onPress={() => connectAndNavigateToDevice(device).then(navigation.navigate("Device"))} style={style.deviceItem}>
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
                <ActivityIndicator />
            </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    deviceItem: {
        width: "90%",
        height: 100,
        backgroundColor: "#808080",
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