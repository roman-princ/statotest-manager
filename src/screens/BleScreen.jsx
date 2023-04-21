import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ScanningScreen from './ScanningScreen';
import useBLE from "../ble/useBLE";
import DeviceScreen from './DeviceScreen';
import FwScreen from './FwScreen';
import TerminalScreen from './TerminalScreen';

const Stack = createNativeStackNavigator();

const BleScreen = () => {
    return(
        <Stack.Navigator initialRouteName='BLE'>
            <Stack.Screen name="BLE" options={{
                headerShown: false,
            }} component={ScanningScreen} />
            <Stack.Screen name="Device" options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#252526',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: "Poppins-SemiBold",
                },
                headerTintColor: '#fff',
            }} component={DeviceScreen} />
            <Stack.Screen name="FwScreen" options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#252526',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: "Poppins-SemiBold",
                },
                headerTintColor: '#fff',
            }} component={FwScreen} />
            <Stack.Screen name="Terminal" options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#252526',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: "Poppins-SemiBold",
                },
                headerTintColor: '#fff',
            }} component={TerminalScreen} />

        </Stack.Navigator>
    )
}


export default BleScreen;