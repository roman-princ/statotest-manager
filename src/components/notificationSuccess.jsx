import { Toast } from 'react-native-toast-message/lib/src/Toast';

const notificationSuccess = message => {
  return Toast.show({
    type: 'success',
    text1: 'OK',
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
  });
};
export default notificationSuccess;
