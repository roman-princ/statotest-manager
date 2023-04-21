import { useCallback, useEffect, useState } from 'react';
import {View, Text, StyleSheet, Alert, Pressable, ScrollView, TextInput, Modal} from 'react-native';
import useBleContext from '../ble/useBLE';
import ButtonDarkRed from '../components/ButtonDarkRed';
import FwScreen from './FwScreen';
import Indicator from '../components/Indicator';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const DeviceScreen = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [measureValue, setMeasureValue] = useState("");
    const [sendValue, setSendValue] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const {currentDevice, startStreamingData, sendCommand, ChesterData} = useBleContext();
    async function sleep(msec) {
        return new Promise(resolve => setTimeout(resolve, msec));
    }
    useEffect(() => {
        const asyncFn = async () => {
            if (currentDevice){
                navigation.setOptions({title: currentDevice.name});
                await startStreamingData(currentDevice).then(() => {
                    sendCommand("stt config show");
                    setIsDisabled(false);
                })
            }
        }
        asyncFn();

    }, []);
    useEffect(() => {
        if(ChesterData.match(/\d+/g) && ChesterData.includes("measure-interval")){
            const regex = /\d+/g;
            const numbers = ChesterData.match(regex);
            console.log(numbers)
            setMeasureValue(numbers[0]);
            setSendValue(numbers[1]);
            console.log(ChesterData)
        }
    }, [ChesterData])
    const handleConfig = useCallback(async () => {
        setIsActive(true);
        setModalVisible(true);
        setIsActive(false);
        
        // if(measureValue !== "" && sendValue !== ""){
        //     setModalVisible(true);
        //     setIsActive(false);
        //     return;
        // }
        // else{
        //     Toast.show({
        //         type: "error",
        //         text1: "Error",
        //         text2: "Something went wrong",
        //         visibilityTime: 2000,
        //         autoHide: true,
        //     });
        //     setIsActive(false);
        //     return;
        // }

        
        
    }, [])


    const handleSave = () => {
        sendCommand("stt config measure-interval " + parseInt(measureValue));
        sendCommand("stt config send-interval " + parseInt(sendValue));
        sendCommand("config save");
        setModalVisible(false);
        Toast.show({
            type: "success",
            text1: "Success",
            text2: "Configuration saved",
            visibilityTime: 2000,
            autoHide: true,
        });
        Alert.alert("Success", "Device is being restarted to apply changes");
        navigation.goBack();
    }

    

    return(
        <>
        <Indicator active={isActive}/>
        <View style={styles.container}>
            <View style={styles.buttons}>
                <ButtonDarkRed text="Measure" args={"stt measure"} disabled={isDisabled}/>
            <Pressable style={styles.button} onPress={async () => {handleConfig()}} disabled={isDisabled}>
                <Text style={styles.buttonTitle}>Config</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => navigation.navigate("FwScreen")} disabled={isDisabled}>
                <Text style={styles.buttonTitle}>Firmware</Text>
            </Pressable>
            <Pressable style={[styles.button, {marginTop: 25}]} onPress={() => navigation.navigate("Terminal")} disabled={isDisabled}>
                <Text style={styles.buttonTitle}>Terminal</Text>
            </Pressable>
            </View>
            <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                         <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{alignItems: "center", width: "100%"}}>
                                    <View style={{flexDirection: "row", }}>
                                        <Text style={[styles.modalText, {borderWidth: 0, fontSize: 15,width: "60%"}]}>Measure interval [s]:</Text>
                                        <TextInput
                                        onChangeText={(text) => setMeasureValue(text)}
                                        keyboardType='numeric'
                                        style={styles.modalText}
                                        >{measureValue}</TextInput>
                                    </View>
                                    

                                    <View style={{flexDirection: "row", }}>    
                                        <Text style={[styles.modalText, {borderWidth: 0, fontSize: 15,width: "60%"}]}>Send interval [s]:</Text>
                                        <TextInput
                                        onChangeText={(text) => setSendValue(text)} 
                                        keyboardType='numeric'
                                        style={styles.modalText}
                                        >
                                            {sendValue}
                                        </TextInput>
                                    </View>
                                </View>
                                
                                <View style={styles.btnContainer}>
                                    <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(false)}>
                                    <Text style={styles.textStyle}>Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => handleSave()}>
                                    <Text style={styles.textStyle}>Save</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      btnContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
      },
      modalView: {
        margin: 20,
        backgroundColor: '#252526',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'black',
      },
      button: {
        borderRadius: 20,
        padding: 10,
        margin: 5,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#F194FF',
      },
      buttonClose: {
        backgroundColor: '#8B0000',
        marginLeft: 20,
      },
      textStyle: {
        color: 'white',
        fontFamily: "Poppins-SemiBold",
        textAlign: 'center',
      },
      modalText: {
        fontSize: 20,
        color: 'white',
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        fontFamily: "Poppins-Medium",
        marginBottom: 15,
        textAlign: 'center',
        width: 100,
      },
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#252526",
    },
    text:{
        fontFamily: "Poppins-Medium",
        fontSize: 15,
        color: "#fff",
    },
    buttons: {
        marginTop: 10,
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "91%",
        alignContent: "stretch",
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
        width: "100%",
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