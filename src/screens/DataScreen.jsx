import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import CompanyScreen from './CompanyScreen';

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

        </Stack.Navigator>
    )
}


export default DataScreen;