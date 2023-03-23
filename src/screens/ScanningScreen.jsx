import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert, Animated} from 'react-native';
import useBleContext from "../ble/useBLE";
import high from "../../assets/images/high.png"
import mid from "../../assets/images/mid.png"
import low from "../../assets/images/low.png"
import styles from '../../assets/style/styles.jsx';
import Indicator from '../components/Indicator';

const ScanningScreen = ({navigation}) => {
    const animated = new Animated.Value(1);
  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.4,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
    const {currentDevice, scanForDevices, requestPermission, devices, connectToDevice, startStreamingData} = useBleContext();
    const [isActive, setIsActive] = useState(true);
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

    const connectAndNavigateToDevice = async (device) => { 
        // setIsActive(true);
        await connectToDevice(device);
        await startStreamingData(currentDevice).then(() => {
            navigation.navigate("Device");
        })
    }

    return(
            <View style={style.container}>
                {devices.map((device) => (
                    <Pressable key={device.id} onPress={() => connectAndNavigateToDevice(device)} style={style.deviceItem} onPressIn={fadeIn} onPressOut={fadeOut}>
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