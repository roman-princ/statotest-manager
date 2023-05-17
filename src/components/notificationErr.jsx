import { Toast } from 'react-native-toast-message/lib/src/Toast';

const notificationError = message => {
  return Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
    visibilityTime: 4000,
    autoHide: true,
  });
};
export default notificationError;
