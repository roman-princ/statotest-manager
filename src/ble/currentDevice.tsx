import { useState } from 'react';
import { useBetween } from 'use-between';
import { Device } from 'react-native-ble-plx';

const useCD = () => {
  const [currentDevice, setConnectedDevice] = useState<Device | null>(null);
  const [ChesterData, setDataChester] = useState<string>('');
  return { currentDevice, setConnectedDevice, ChesterData, setDataChester };
};

const useCurrentDevice = () => useBetween(useCD);
export default useCurrentDevice;
