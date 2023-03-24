import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import BleScreen from "./src/screens/BleScreen"
import LoginScreen from './src/screens/LoginScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: "Poppins-Semibold",
              color: "#fff",
              marginBottom: 5,
            },
            tabBarHideOnKeyboard: true,
        }}>
        <Tab.Screen name="Login" component={LoginScreen}
        options={{
          tabBarIcon: () => (
            <Icon name="login" color={"#8b0000"} size={26} />
          ),
          
        }}
        />
        <Tab.Screen name="Connect to CHESTER" component={BleScreen}
        options={{
          tabBarIcon: ({focused }) => (
            <Icon name={focused ? "bluetooth-connected" : "bluetooth"} color={"#8b0000"} size={26} />
          ),
        }}
         />
      </Tab.Navigator>
    </NavigationContainer>
      
    );
}

export default App;