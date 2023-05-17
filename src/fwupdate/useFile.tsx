import * as React from 'react';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';
import notificationError from '../components/notificationErr';
interface IFile {
  pickFile: () => void;
  file: DocumentPickerResponse | DirectoryPickerResponse | null | undefined;
}

const useFile = (): IFile => {
  const [file, setFile] = React.useState<
    DocumentPickerResponse | DirectoryPickerResponse | null
  >();

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      notificationError('File selection cancelled');
    } else if (isInProgress(err)) {
      notificationError('File selection already in progress');
    } else {
      notificationError('Unknown error');
    }
  };

  const pickFile = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: types.allFiles,
        copyTo: 'cachesDirectory',
      });
      setFile(pickerResult);
    } catch (err) {
      handleError(err);
    }
  };

  return { pickFile, file };
};

export default useFile;
