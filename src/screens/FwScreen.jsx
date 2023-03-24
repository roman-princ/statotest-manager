import {View, Text, StyleSheet, Pressable} from "react-native"
import useBleContext from "../ble/useBLE";
import {useEffect} from "react";
import useFile from "../fwupdate/useFile";

const FwScreen = ({navigation}) => {
    const {pickFile, file} = useFile()
    const {currentDevice, ChesterData} = useBleContext();
    useEffect(() => {
        if (currentDevice){
            navigation.setOptions({title: currentDevice.name});
        }
    }, [currentDevice]);
    return(
        <View style={styles.container}>
            <Pressable onPress={() => pickFile()}>
                <Text style={styles.text}>{file ? file.name : "Pick a file"}</Text>
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
});
export default FwScreen;