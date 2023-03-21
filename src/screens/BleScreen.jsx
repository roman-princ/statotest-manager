import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ScanningScreen from './ScanningScreen';
import useBLE from "../ble/useBLE";
import DeviceScreen from './DeviceScreen';


const Stack = createNativeStackNavigator();

const BleScreen = () => {
    const {currentDevice} = useBLE();
    return(
        <Stack.Navigator initialRouteName='BLE'>
            <Stack.Screen name="BLE" options={{
                headerShown: false,
            }} component={ScanningScreen} />
            <Stack.Screen name="Device" options={{
                headerShown: true,
            }} component={DeviceScreen} />

        </Stack.Navigator>
    )
}


export default BleScreen;