import { useState } from 'react';
import { useBetween } from 'use-between';
import { Device } from 'react-native-ble-plx';

const useCD = () => {
  const [currentDevice, setConnectedDevice] = useState<Device | null>(null);
  return { currentDevice, setConnectedDevice };
};

const useCurrentDevice = () => useBetween(useCD);
export default useCurrentDevice;
