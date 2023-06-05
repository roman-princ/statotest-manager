import { Platform, PermissionsAndroid, Alert } from 'react-native';
import {
  BleError,
  BleManager,
  Device,
  Characteristic,
  ScanMode,
  ConnectionOptions,
} from 'react-native-ble-plx';
import { useState } from 'react';
import { useBetween } from 'use-between';
import { atob, btoa } from 'react-native-quick-base64';
import notificationError from '../components/notificationErr';
import useCurrentDevice from './currentDevice';

const CHESTER_SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const CHESTER_RECIEVE_CHARACTERISTIC_UUID =
  '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
const CHESTER_SEND_CHARACTERISTIC_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';

const scanningOptions = {
  scanMode: ScanMode.LowLatency,
};
const connectOptions: ConnectionOptions = {
  requestMTU: 512,
  autoConnect: false,
};
type PermissionCallback = (result: boolean) => void;

interface BluetoothLowEnergyAPI {
  requestPermission(callback: PermissionCallback): Promise<void>;
  connectToDevice(device: Device): Promise<boolean>;
  ChesterData: string;
  scanForDevices(): void;
  startStreamingData(device: Device): void;
  onDataReceived(
    error: Error | null,
    characteristic: Characteristic | null,
  ): boolean;
  sendCommand(command: string): void;
  stopAndStartScan(): void;
  devices: Device[];
  setData(data: string): void;
}
const bleManager = new BleManager();

function useBleContext(): BluetoothLowEnergyAPI {
  const [devices, setDevices] = useState<Device[]>([]);
  // const [currentDevice, setConnectedDevice] = useState<Device | null>(null);
  const { currentDevice, setConnectedDevice, ChesterData, setDataChester } =
    useCurrentDevice();
  // const [ChesterData, setDataChester] = useState<string>('');
  const setData = (data: string) => {
    setDataChester(prevData => prevData + data);
  };
  const requestPermission = async (callback: PermissionCallback) => {
    if (Platform.OS === 'android') {
      const grantedStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Bluetooth Permission',
          message:
            'This app needs access to bluetooth to scan for CHESTER senosrs',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      callback(true);
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForDevices = () => {
    bleManager.startDeviceScan(null, scanningOptions, (error, device) => {
      if (error) {
        if (error.errorCode === 600) {
          notificationError(
            'Please enable bluetooth to scan for CHESTER sensors',
          );
        }
        return;
      }
      if (device && device.name?.includes('CHESTER')) {
        setDevices(prevState => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const connectToDevice = async (device: Device): Promise<boolean> => {
    try {
      bleManager.cancelDeviceConnection(device.id);
      setDataChester('');
      const connectedDevice = await bleManager.connectToDevice(
        device.id,
        connectOptions,
      );
      if (connectedDevice != null) {
        setConnectedDevice(connectedDevice);
        await connectedDevice.discoverAllServicesAndCharacteristics();
        sendCommand('help');
        bleManager.stopDeviceScan();
        return true; // Connection succeeded
      } else {
        return false; // Connection failed
      }
    } catch (error) {
      notificationError('Error connecting to device');
      return false; // Connection failed
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device != null) {
      device.monitorCharacteristicForService(
        CHESTER_SERVICE_UUID,
        CHESTER_RECIEVE_CHARACTERISTIC_UUID,
        (error, characteristic) => onDataReceived(error, characteristic),
      );
    } else {
      notificationError('No device connected');
    }
  };
  const onDataReceived = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ): boolean => {
    if (error) {
      notificationError(error.message);
      Alert.alert('Error', error.message);
      return false;
    } else if (!characteristic?.value) {
      notificationError('No data received');
      return false;
    }

    const decodedData = atob(characteristic.value);
    setData(decodedData);
    return true;
  };
  const sendCommand = (command: string) => {
    setDataChester('');
    if (currentDevice) {
      currentDevice.writeCharacteristicWithResponseForService(
        CHESTER_SERVICE_UUID,
        CHESTER_SEND_CHARACTERISTIC_UUID,
        btoa(command + '\r\n'),
      );
    }
  };
  const stopAndStartScan = () => {
    bleManager.stopDeviceScan();
    setDevices([]);
    scanForDevices();
  };
  bleManager.onDeviceDisconnected(currentDevice?.id || '', () => {
    setConnectedDevice(null);
  });

  return {
    requestPermission,
    scanForDevices,
    devices,
    connectToDevice,
    startStreamingData,
    // currentDevice,
    ChesterData,
    onDataReceived,
    sendCommand,
    stopAndStartScan,
    setData,
  };
}

export default useBleContext;
