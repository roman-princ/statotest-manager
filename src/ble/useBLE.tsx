import { Platform, PermissionsAndroid, Alert } from "react-native";
import { BleError, BleManager, Device, Characteristic, ScanMode } from "react-native-ble-plx";
import { useState, useMemo, useEffect } from "react";
import { useBetween } from "use-between";

import { atob, btoa } from "react-native-quick-base64";

const CHESTER_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const CHESTER_RECIEVE_CHARACTERISTIC_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
const CHESTER_SEND_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const UART_GATT_SMP_SERVICE_UUID = "8D53DC1D-1DB7-4CD3-868B-8A527460AA84";
const UART_GATT_SMP_CHARACTERISTIC_UUID = "DA2E7828-FBCE-4E01-AE9E-261174997C48";

const scanningOptions = {
    scanMode: ScanMode.LowLatency,
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
    handleDisconnect(): void;
    devices: Device[];
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
                    Alert.alert("Restart Bluetooth.");
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
            await bleManager.connectToDevice(device.id).then(async (device1: Device) => {
                setConnectedDevice(device1)
                await device1.discoverAllServicesAndCharacteristics()
                device1.onDisconnected(() => {
                    console.log("device disconnected");
                });
            });
            // bleManager.stopDeviceScan();
        }catch(error) {
            console.log(JSON.stringify(error));
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
            return;
        }else if (!characteristic?.value) {
            Alert.alert("No characteristic found (Are you sure you're connected to the right device?)");
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

    const handleDisconnect = () => {
        if (currentDevice) {
            currentDevice.cancelConnection().then(() => {
                setConnectedDevice(null);
                stopAndStartScan();
            });
        }
    };
    
    return { requestPermission, scanForDevices, devices, connectToDevice, startStreamingData, currentDevice, ChesterData, onDataReceived, sendCommand, stopAndStartScan, handleDisconnect};
}
const useBleContext = () => useBetween(useBLE);
export default useBleContext;


