import * as React from "react";
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isInProgress,
    types,
  } from 'react-native-document-picker'
import { Alert } from "react-native";

    const useFile = () => {
    const [file, setFile] = React.useState<DocumentPickerResponse | DirectoryPickerResponse | null>();

    const handleError = (err: unknown) => {
        if(DocumentPicker.isCancel(err)) {
            Alert.alert('No file selected');
        }
        else if(isInProgress(err)) {
            Alert.alert('File selection already in progress');
        }
        else {
            Alert.alert('Unknown error');
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