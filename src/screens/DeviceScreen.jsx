import {View, Text, StyleSheet} from 'react-native';
import useBLE from '../ble/useBLE';

const DeviceScreen = ({navigation}) => {
    const { currentDevice } = useBLE();
    return(
        <View style={styles.container}>
            <Text style={styles.text}>cau</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    text:{
        fontFamily: "Poppins-Medium",
        fontSize: 30
    }

});

export default DeviceScreen;