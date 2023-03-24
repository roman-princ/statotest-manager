import {Upgrade, UpgradeMode} from "@playerdata/react-native-mcu-manager"
import {useEffect, useState, useRef} from "react"
import {DocumentPickerResponse} from "react-native-document-picker";

const useFwUpdate = (
    bleId: string | null,
    file: DocumentPickerResponse | null,
    upgradeMode?: UpgradeMode
) => {

    const [progress, setProgress] = useState(0);
    const [state, setState] = useState("");
    const upgradeRef = useRef<Upgrade>();
    // nevím proč to nefunguje a je tam syntax error, hodit do chatbota
    useEffect(() => {
        if(!bleId || !upgradeMode){
            return () => null;
        }
        const upgrade = new Upgrade(bleId, file?.uri, {
            estimatedSwapTime: 60,
            upgradeMode,
          });
      
          upgradeRef.current = upgrade;
      
          const uploadProgressListener = upgrade.addListener(
            'uploadProgress',
            ({ progress: newProgress }) => {
              setProgress(newProgress);
            }
          );
      
          const uploadStateChangedListener = upgrade.addListener(
            'upgradeStateChanged',
            ({ state: newState }) => {
              setState(newState);
            }
          );
      
          return function cleanup() {
            uploadProgressListener.remove();
            uploadStateChangedListener.remove();
      
            upgrade.cancel();
            upgrade.destroy();
          };
    }, [bleId, upgradeMode, upgradeMode]);
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
    
      return { progress, runUpdate, state, cancelUpdate };
}
export default useFwUpdate;
