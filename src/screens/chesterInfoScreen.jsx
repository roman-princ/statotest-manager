import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useEffect, useState } from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import useBleContext from '../ble/useBLE';
import dayjs from 'dayjs';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DeviceInfoScreen = ({route, navigation}) => {
    const {API_URL} = useBleContext(); 
    const [modalVisible, setModalVisible] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [device, setDevice] = useState(null);
    const [desc, setDesc] = useState("");
    const [MP, setMP] = useState(route.params?.MP);
    const FetchDevices = async (token) => {
            await axios.post(API_URL + "MP/dev/get",{
                compId: route.params?.compId,
                consId: route.params?.consId,
                mpId: route.params?.MP.mpId
            }, 
            {
                headers:{
                    'Authorization': String(token).replace(/['"]+/g, ''),
                    'Content-Type' : 'application/json'
                }
            }
            ).then((response) => {
                axios.post(API_URL + "Device/Get",{
                    devId: response.data[0].devId
                },
                {
                    headers:{
                        'Authorization': String(token).replace(/['"]+/g, ''),
                        'Content-Type' : 'application/json'
                    }
                }
                ).then((response) => {
                    console.log(response.data);
                    setDevice(response.data);
                }).catch((error) => {
                    console.log(JSON.stringify(error));
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Something went wrong",
                        visibilityTime: 2000,
                        autoHide: true,
                    })
                })
            }).catch((error) => {
                console.log(JSON.stringify(error));
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Something went wrong",
                    visibilityTime: 2000,
                    autoHide: true,
                })
            })
            trigger("notificationSuccess", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
        }
    useEffect(() => {
        AsyncStorage.getItem("@token").then((token) => {
            FetchDevices(token).then(() => {
                navigation.setOptions({title: device.devSn ? "CHESTER " + device.devSn : "Device info"})
            })
        })
        
    }, [])


    const handleClick = async () => {
        setModalVisible(!modalVisible)
        await AsyncStorage.getItem("@token").then((token) => {
            axios.post(API_URL + "MP/Upd",{
                compId: route.params?.compId,
                mpId: MP.mpId,
                mpDesc: desc,

            },
            {
                headers:{
                    'Authorization': String(token).replace(/['"]+/g, ''),
                    'Content-Type' : 'application/json'
                }
            }
            ).then((response) => {
                Toast.show({
                    type: "success",
                    text1: "Description updated to " + desc,
                    text2: "",
                    visibilityTime: 2000,
                    autoHide: true,
                })
                

            }).catch((error) => {
                console.log(JSON.stringify(error));
                trigger("notificationError", {ignoreAndroidSystemSettings: false, enableVibrateFallback: true})
                   Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Something went wrong",
                        visibilityTime: 2000,
                        autoHide: true,
                   })
            })
        })
        
    }

    return(
        <ScrollView scrollEnabled={true} style={styles.scrollView}>
            {device && 
            <>
                    <Text style={styles.bigTitle}>Device info</Text>
                    <View style={styles.container} key={device.devId}>
                        
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Device Name:</Text>
                                <Text style={styles.value}>{device.devName ? device.devName : "Unknown"}</Text>
                            </View>
                            
                        
                            <View style={styles.col}>
                                <Text style={styles.title}>Device Type:</Text>
                                <Text style={styles.value}>{device.devType ? device.devType : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Serial Number:</Text>
                                <Text style={styles.value}>{device.devSn ? device.devSn : "Unknown"}</Text>
                            </View>

                            <View style={styles.col}>
                                <Text style={styles.title}>Description</Text>
                                <Text style={[styles.value, {width: "85%"}]}>{device.devDesc ? device.devDesc : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Status:</Text>
                                <Text style={[styles.value, {color: device.devStatus == "Active" || device.devStatus == "Registered" ? "green" : "red"}]}>{device.devStatus ? device.devStatus : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Battery:</Text>
                                <Text style={[styles.value, {color: device.devBattery <= 51 ? "orange" : "green"}]}>{device.devBattery ? device.devBattery + "%" : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Firmware:</Text>
                                <Text style={styles.value}>{device.firmware ? device.firmware : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Temperature:</Text>
                                <Text style={styles.value}>{device.devTemperature ? device.devTemperature + " °C" : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Last updated:</Text>
                                <Text style={styles.value}>{device.dateTimeLastComm ? dayjs(device.dateTimeLastComm).format("d. MMMM YYYY, HH:MM:ss") : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Humidity:</Text>
                                <Text style={styles.value}>{device.devHumidity ? device.devHumidity : "Unknown"}</Text>
                            </View>
                        </View>
                    </View>


                    <Text style={styles.bigTitle}>Measurement point info</Text>
                    <View style={styles.container}>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Name:</Text>
                                <Text style={styles.value}>{MP.mpName ? MP.mpName : "Unknown"}</Text>
                            </View>
                            <Pressable style={[styles.col, {borderColor: "#808080", borderWidth: 1}]} onPress={() => setModalVisible(true)}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={styles.title}>Description:</Text>
                                    <Icon name="edit" size={15} color="#808080"/>
                                </View>
                                
                                <Text style={[styles.value, {width: "85%"}]}>{MP.mpDesc ? MP.mpDesc : "Unknown"}</Text>
                            </Pressable>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Added:</Text>
                                <Text style={styles.value}>{MP.dateTimeAdd ? dayjs(MP.dateTimeAdd).format("d. MMMM YYYY, HH:MM:ss") : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Updated:</Text>
                                <Text style={styles.value}>{MP.dateTimeUpdate ? dayjs(MP.dateTimeUpdate).format("d. MMMM, HH:MM:ss") : "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.title}>Latitude:</Text>
                                <Text style={styles.value}>{MP.mpLat ? MP.mpLat : "Unknown"}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.title}>Longitude:</Text>
                                <Text style={styles.value}>{MP.mpLon ? MP.mpLon : "Unknown"}</Text>
                            </View>
                        </View>
                    </View>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                         <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TextInput
                                 onChangeText={(text) => setDesc(text)} 
                                 style={styles.modalText}
                                 multiline={true}
                                 >{MP.mpDesc}</TextInput>
                                <View style={styles.btnContainer}>
                                    <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.textStyle}>Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => handleClick()}>
                                    <Text style={styles.textStyle}>Save</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    </>
        }

    </ScrollView>     
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
        width: '100%',
        justifyContent: 'flex-end',
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
        width: 250,
      },
    container: {
        alignItems: "center",
        backgroundColor: '#252526',
        height: '100%',
        width: "95%",
        flexWrap: "wrap",
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
    },
    col:{
        width: "48%",
        marginBottom: 15,
        flexDirection: "column",
        flexWrap: "wrap",  
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 10,
        borderRadius: 10,
    },
    title: {
        color: '#fff',
        fontSize: 11,
        width: '90%',
        fontFamily: "Poppins-Medium"
    },
    bigTitle: {
        color: '#fff',
        fontSize: 25,
        width: '100%',
        fontFamily: "Poppins-SemiBold",
        marginTop: 20,
        textAlign: "center",
    },

    value:{
        color: '#fff',
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        width: '100%',
        marginBottom: 20
    },
    scrollView: {
        backgroundColor: '#252526',
        height: '100%',
        width: '100%',
    }
});
export default DeviceInfoScreen;