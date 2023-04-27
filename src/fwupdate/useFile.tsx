import * as React from "react";
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isInProgress,
    types,
  } from 'react-native-document-picker'
import { Alert, NativeModules } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
interface IFile {
    pickFile: () => void;
    file: DocumentPickerResponse | DirectoryPickerResponse | null | undefined;
}

    const useFile = () : IFile => {
        const [file, setFile] = React.useState<DocumentPickerResponse | DirectoryPickerResponse | null>();

        const handleError = (err: unknown) => {
            if(DocumentPicker.isCancel(err)) {
                Toast.show({
                    type: 'error',
                    text1: 'File selection cancelled',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }
            else if(isInProgress(err)) {
                Toast.show({
                    type: 'error',
                    text1: 'File selection already in progress',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Unknown error',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }
        }

        const pickFile = async () => {
            try {
                const pickerResult = await DocumentPicker.pickSingle({
                    presentationStyle: 'fullScreen',
                    type: types.allFiles,
                    copyTo: 'cachesDirectory',
                })
                setFile(pickerResult);
            }
            catch(err) {
                handleError(err);
            }
        }

        return {pickFile, file}
    };

export default useFile;