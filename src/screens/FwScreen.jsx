import {View, Text, StyleSheet, Pressable, ScrollView} from "react-native"
import useBleContext from "../ble/useBLE";
import {useEffect} from "react";
import useFile from "../fwupdate/useFile";
import useFwUpdate from "../fwupdate/useFwUpdate";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {UpgradeMode} from "@playerdata/react-native-mcu-manager";
import SizedBox from "../components/SizedBox";
import { Bar } from "react-native-progress";

const FwScreen = ({navigation}) => {
    const {pickFile, file} = useFile()
    const {currentDevice, sendCommand, ChesterData} = useBleContext();
    const {cancelUpdate, runUpdate, progress, state} = useFwUpdate(
        currentDevice.id,
        file?.uri || null,
        UpgradeMode.TEST_ONLY
    );
    useEffect(() => {
        if (currentDevice){
            navigation.setOptions({title: currentDevice.name});
            sendCommand("mcuboot");
        }
        else{
            navigation.goBack();
        }
    }, []);
    return(
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.text}>{ChesterData}</Text>
                <SizedBox height={30} />
            </ScrollView>
            <Pressable onPress={() => pickFile()} style={{width: "91%", marginBottom: 10}}>
                <View style={styles.uploadButton}>
                    <Icon name="file-upload" size={30} color="#FFFFFF" />
                    <Text style={styles.buttonTitle}>{file ? file.name : "Pick a file"}</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => runUpdate()} style={{width: "50%", marginBottom: 10}} disabled={file ? false : true }>
                <View style={styles.uploadButton}>
                    <Icon name="cloud-upload" size={30} color="#FFFFFF" style={{marginRight: 5}}/>
                    <Text style={styles.buttonTitle}>Upload</Text>
                </View>
            </Pressable>
            <View style={{flexDirection: "row", justifyContent: "center", flex: 1, alignItems: "center", height: 30}}>
                <Bar progress={progress / 100} width={200} height={10} color="#8B0000" />
                <Text style={[styles.text, {marginLeft: 10}]}>{progress}%</Text>
            </View>
            <Text style={styles.text}>State: {state}</Text>

            
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
    scrollView: {
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        width: "91%",
        height: "60%",
        backgroundColor: "#353535",
        padding: 10,
        flexGrow: 0,
    },
    uploadButton: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#8B0000',
        borderRadius: 8,
        padding: 10,
        height: 50,
        width: "100%",
        justifyContent: 'center',
        },
    buttonTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 22,
        fontFamily: "Poppins-Medium"
    },
    buttons:{
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "baseline",
        width: "100%",
    }

});
export default FwScreen;