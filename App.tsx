import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import BleScreen from "./src/screens/BleScreen"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DataScreen from './src/screens/DataScreen';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {trigger} from "react-native-haptic-feedback"
import useBleContext from './src/ble/useBLE';
import { navigate, navigationRef } from './src/navigation/RootNavigation';


const Tab = createBottomTabNavigator();
const App = () => {
  const [token, setToken] = useState("")
  const {currentDevice} = useBleContext();
  useEffect(() => {
    AsyncStorage.getItem("token").then((value) => {
      if (value) {
        setToken(value)
      }
    }
    )
  }, []);

  return (
    //nějak se to cyklí, když se připojím k BLE, tak se provede trigger několikrát
    <NavigationContainer /*ref={navigationRef}*/ theme={DarkTheme} onStateChange={() => trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false } )}>
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
        <Tab.Screen name="Login" component={DataScreen}
        options={{
          tabBarIcon: () => (
            <Icon name={"apartment"} color={"#8b0000"} size={26} />
          ),
          title: "Dashboard"
          
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