import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
const Tab = createMaterialBottomTabNavigator();
import BleScreen from "./src/screens/BleScreen"
import LoginScreen from './src/screens/LoginScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MainScreen = () => {
  return (
    <NavigationContainer>
        <Tab.Navigator theme={DarkTheme}>
        <Tab.Screen name="Login" component={LoginScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="login" color={color} size={26} />
          ),
        }}
        />
        <Tab.Screen name="Connect to CHESTER" component={BleScreen}
        options={{
          tabBarIcon: ({focused, color }) => (
            <Icon name={focused ? "bluetooth-connected" : "bluetooth"} color={color} size={26} />
          ),
        }}
         />
      </Tab.Navigator>
    </NavigationContainer>
      
    );
}

export default MainScreen;