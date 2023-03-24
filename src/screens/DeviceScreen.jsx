import { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Alert, Pressable, ScrollView, TextInput} from 'react-native';
import useBleContext from '../ble/useBLE';
import ButtonDarkRed from '../components/ButtonDarkRed';
import FwScreen from './FwScreen';
import Indicator from '../components/Indicator';

const DeviceScreen = ({navigation}) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const {currentDevice, ChesterData, startStreamingData} = useBleContext();
    const [command, setCommand] = useState("");
    useEffect(() => {
        const asyncFn = async () => {
            if (currentDevice){
                navigation.setOptions({title: currentDevice.name});
                await startStreamingData(currentDevice).then(() => {
                    setIsDisabled(false);
                })
            }
        }
        asyncFn();
        return () => {
            setIsDisabled(true);
            navigation.goBack();
        }

    }, [currentDevice]);

    

    return(
        <View style={styles.container}>
            <View style={styles.buttons}>
                <ButtonDarkRed text="Measure" args={"stt measure"} disabled={isDisabled}/>
                <ButtonDarkRed text="Config" args={"mcuboot"} disabled={isDisabled} />
            <Pressable style={styles.button} onPress={() => navigation.navigate("FwScreen")} disabled={isDisabled}>
                <Text style={styles.buttonTitle}>FW Update</Text>
            </Pressable>
            </View>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.text}>{ChesterData}</Text>
            </ScrollView>
                <Pressable style={styles.sendCommandContainer}>
                    <View style={styles.form}>
                        <TextInput
                            autoCapitalize="none"
                            placeholder="Enter Command..."
                            placeholderTextColor={"rgba(235, 235, 245, 0.6)"}
                            autoCorrect={false}
                            onChangeText={(text) => setCommand(text)}
                            keyboardType="default"
                            returnKeyType="next"
                            placeholderFontFamily="Poppins-Medium"
                            style={styles.textInput}
                            textContentType="none"
                        />
                    </View>
                    <ButtonDarkRed text="Send" args={command} disabled={isDisabled}/>
                </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#252526",
    },
    text:{
        fontFamily: "Poppins-Medium",
        fontSize: 15
    },
    buttons: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "95%",
    },
    scrollView: {
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        width: "91%",
        height: "89%",
        backgroundColor: "#353535",
        padding: 10,
        flexGrow: 0,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#8B0000',
        borderRadius: 8,
        height: 50,
        width: 100,
        justifyContent: 'center',
        },
    buttonTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 22,
        fontFamily: "Poppins-Medium"
    },
    form: {
        alignItems: 'center',
        backgroundColor: '#353535',
        borderRadius: 8,
        flexDirection: 'row',
        height: 50,
        paddingHorizontal: 16,
        width: "100%",
        flex: 1,
        flexGrow: 1,
        marginRight: 10,
        
    },
    textInput: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: "Poppins-Medium",
        backgroundColor: "#353535",
    },
    sendCommandContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "91%",
        marginBottom: 10,
    }

});

export default DeviceScreen;