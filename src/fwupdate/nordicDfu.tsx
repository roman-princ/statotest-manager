import { NativeEventEmitter, NativeModules } from 'react-native';

const { NativeNordicDfu } = NativeModules;

export class NordicDfu {
  start(deviceId: string, filePath: string) {
    const estimatedSwapTime = 30;

    NativeNordicDfu.startDfu(deviceId, filePath, estimatedSwapTime);
  }

  cancel() {
    NativeNordicDfu.cancelDfu();
  }
}

export const NordicDfuEmitter = new NativeEventEmitter(NativeNordicDfu);

export type NordicDfuState = 'none' | 'validate' | 'upload' | 'test' | 'reset' | 'confirm';

export type NordicDfuFailType = 'connection' | 'data' | 'upgrade';
