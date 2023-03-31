import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import CompanyScreen from './CompanyScreen';
import ConstructionScreen from './ConstructionScreen';
import MPScreen from './MPScreen';
import DeviceInfoScreen from './DeviceInfoScreen';

const Stack = createNativeStackNavigator();

const DataScreen = () => {
    return(
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" options={{
                headerShown: false,
            }} component={LoginScreen} />
            <Stack.Screen name="Company" options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#252526',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: "Poppins-SemiBold",
                },
                headerTintColor: '#fff',
            }} component={CompanyScreen} />
            <Stack.Screen name="Construction" options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#252526',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: "Poppins-SemiBold",
                },
                headerTintColor: '#fff',
                title: 'Constructions'
            }} component={ConstructionScreen} />
            <Stack.Screen name="MP" options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#252526',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: "Poppins-SemiBold",
                },
                headerTintColor: '#fff',
                title: 'Measurement Points'
            }} component={MPScreen} />
            <Stack.Screen name="DeviceInfo" options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#252526',
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: "Poppins-SemiBold",
                },
                headerTintColor: '#fff',
                title: 'Device Info'
            }} component={DeviceInfoScreen} />
        </Stack.Navigator>
    )
}


export default DataScreen;