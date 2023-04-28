import {
  Upgrade,
  UpgradeMode,
  eraseImage,
} from '@playerdata/react-native-mcu-manager';
import { useEffect, useState, useRef } from 'react';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import useBleContext from '../ble/useBLE';

const useFwUpdate = (
  bleId: string | null,
  fileUri: string | null,
  upgradeMode?: UpgradeMode,
) => {
  const { sendCommand } = useBleContext();
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState('');
  const [isActive, setIsActive] = useState(false);
  const upgradeRef = useRef<Upgrade>();
  useEffect(() => {
    if (!bleId || !fileUri) {
      return () => null;
    }
    const upgrade = new Upgrade(bleId, fileUri, {
      estimatedSwapTime: 60,
      upgradeMode,
    });

    upgradeRef.current = upgrade;

    const uploadProgressListener = upgrade.addListener(
      'uploadProgress',
      ({ progress: newProgress }) => {
        setProgress(newProgress);
      },
    );

    const uploadStateChangedListener = upgrade.addListener(
      'upgradeStateChanged',
      ({ state: newState }) => {
        setState(newState);
      },
    );

    return function cleanup() {
      uploadProgressListener.remove();
      uploadStateChangedListener.remove();

      upgrade.cancel();
      upgrade.destroy();
    };
  }, [bleId, upgradeMode, fileUri]);
  const runUpdate = async (): Promise<void> => {
    try {
      if (!upgradeRef.current) {
        throw new Error('No upgrade class - missing BleId or updateFileUri?');
      }

      await upgradeRef.current.runUpgrade();
    } catch (ex: any) {
      setState(ex.message);
    }
  };

  const cancelUpdate = (): void => {
    if (!upgradeRef.current) return;

    upgradeRef.current.cancel();
  };

  const deleteImage = async (): Promise<void> => {
    setIsActive(true);
    if (!upgradeRef.current) {
      setIsActive(false);
      return;
    }
    if (bleId !== null) {
      eraseImage(bleId)
        .then(() => {
          sendCommand('mcuboot');
          Toast.show({
            type: 'success',
            text1: 'Image erased',
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text1: 'Error erasing image',
            text2: error.message,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    } else
      Toast.show({
        type: 'error',
        text1: 'No device connected',
        visibilityTime: 3000,
        autoHide: true,
      });
    setIsActive(false);
  };

  return { progress, runUpdate, state, cancelUpdate, deleteImage, isActive };
};
export default useFwUpdate;
