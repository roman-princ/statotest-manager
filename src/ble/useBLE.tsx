import { Platform, PermissionsAndroid, Alert } from "react-native";
import { BleError, BleManager, Device, Characteristic, ScanMode, ConnectionOptions } from "react-native-ble-plx";
import { useState } from "react";
import { useBetween } from "use-between";

import { atob, btoa } from "react-native-quick-base64";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const CHESTER_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const CHESTER_RECIEVE_CHARACTERISTIC_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
const CHESTER_SEND_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

const scanningOptions = {
    scanMode: ScanMode.LowLatency,
  };
const connectOptions : ConnectionOptions = {
    requestMTU: 512,
    autoConnect: false,
};
type PermissionCallback = (result: boolean) => void;

interface BluetoothLowEnergyAPI {
    requestPermission(callback: PermissionCallback) : Promise<void>;
    connectToDevice(device: Device) : Promise<void>;
    currentDevice: Device | null;
    ChesterData: string;
    scanForDevices() : void;
    startStreamingData(device: Device) : void;
    onDataReceived(error : Error | null, characteristic: Characteristic|null) : void;
    sendCommand(command: string): void;
    stopAndStartScan(): void;
    devices: Device[];
    API_URL: string;
}
const bleManager = new BleManager();

function useBLE(): BluetoothLowEnergyAPI {
    const [devices, setDevices] = useState<Device[]>([]);
    const [currentDevice, setConnectedDevice] = useState<Device | null>(null);
    const [ChesterData, setData] = useState<string>("");
    const requestPermission = async (callback: PermissionCallback) => {
        if(Platform.OS === "android") {
            const grantedStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Bluetooth Permission",
                    message: "This app needs access to your bluetooth to scan for CHESTER senosrs",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
        callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED)
        }else{
            callback(true);
        }
    };

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) => 
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const scanForDevices = () => {
        bleManager.startDeviceScan(null, scanningOptions, (error, device) => {
            if(error) {
                console.log(JSON.stringify(error.errorCode));
                if(error.errorCode === 600) {
                    Toast.show({
                        type: "error",
                        text1: "Bluetooth is disabled",
                        text2: "Please enable bluetooth to scan for CHESTER sensors",
                        visibilityTime: 4000,
                        autoHide: true,
                    });
                }
                return;
            }
            if(device && device.name?.includes("CHESTER")) {
                setDevices((prevState) => {
                    if(!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });
    };

    const connectToDevice = async (device: Device) => {
        try{
            setData("");
            await bleManager.connectToDevice(device.id, connectOptions).then(async (device1: Device) => {
                setConnectedDevice(device1)
                await device1.discoverAllServicesAndCharacteristics()
            });
            bleManager.stopDeviceScan();
        }catch(error) {
            Toast.show({
                type: "error",
                text1: "Error connecting to device",
                text2: "Please try again",
                visibilityTime: 3000,
                autoHide: true,
            });
        }
    };

    const startStreamingData = async (device: Device) => {
        if (device != null) {
            device.monitorCharacteristicForService(
                CHESTER_SERVICE_UUID,
                CHESTER_RECIEVE_CHARACTERISTIC_UUID,
                (error, characteristic) => onDataReceived(error, characteristic) 
            );
        }
        else {
            console.log("No device connected");
        }
    }
    const onDataReceived = (
        error: BleError | null,
        characteristic: Characteristic | null
    ) => {
        if (error) {
            console.log(JSON.stringify(error));
            Toast.show({
                type: "error",
                text1: error.message,
                visibilityTime: 3000,
                autoHide: true,
            });
            return;
        }else if (!characteristic?.value) {
            Toast.show({
                type: "error",
                text1: "No data received",
                visibilityTime: 3000,
                autoHide: true,
            });
            return;
        }
        
        const decodedData = atob(characteristic.value);
        return setData((prevState) => prevState + decodedData);
        

    };
    const sendCommand = (command: string) => {
        setData("");
        if (currentDevice) {
            currentDevice.writeCharacteristicWithResponseForService(
                CHESTER_SERVICE_UUID,
                CHESTER_SEND_CHARACTERISTIC_UUID,
                btoa(command + "\r\n")
            );
        }
    };
    const stopAndStartScan = () => {
        bleManager.stopDeviceScan();
        setDevices([]);
        scanForDevices();
    }

   
    

    
    
    return { requestPermission, scanForDevices, devices, connectToDevice, startStreamingData, currentDevice, ChesterData, onDataReceived, sendCommand, stopAndStartScan, API_URL: "https://statotestapiv3.azurewebsites.net/"};
}
const useBleContext = () => useBetween(useBLE);
export default useBleContext;


