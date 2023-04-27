import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import BleScreen from "./src/screens/scanScreen"
import Icon from 'react-native-vector-icons/MaterialIcons';
import bleStackNav from './src/nav/bleStackNav';
import {trigger} from "react-native-haptic-feedback"
import Toast from 'react-native-toast-message';
import apiStackNav from './src/nav/apiStackNav';


const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <>
    <NavigationContainer theme={DarkTheme} onStateChange={() => trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false } )}>
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
        <Tab.Screen name="Login" component={apiStackNav}
        options={{
          tabBarIcon: () => (
            <Icon name={"apartment"} color={"#8b0000"} size={26} />
          ),
          title: "Home"
          
        }}
        />
        <Tab.Screen name="Search Device" component={bleStackNav}
        options={{
          tabBarIcon: ({focused }) => (
            <Icon name={focused ? "bluetooth-connected" : "bluetooth"} color={"#8b0000"} size={26} />
          ),
        }}
         />
      </Tab.Navigator>
    </NavigationContainer>
    <Toast />
    </>
    );
}

export default App;