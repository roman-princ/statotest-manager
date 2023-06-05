import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import useBleContext from '../ble/useBLE';
import Indicator from '../components/activityIndicator';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import notificationSuccess from '../components/notificationSuccess';
import useCurrentDevice from '../ble/currentDevice';
import notificationError from '../components/notificationErr';

const chesterBleScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRTCVisible, setModalRTCVisible] = useState(false);
  const [isActive] = useState(false);
  const [measureValue, setMeasureValue] = useState('');
  const [currentTime, setCurrentTime] = useState();
  const [sendValue, setSendValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const { startStreamingData, sendCommand, ChesterData } = useBleContext();
  const { currentDevice } = useCurrentDevice();
  useEffect(() => {
    const initFn = async () => {
      if (currentDevice) {
        navigation.setOptions({ title: currentDevice.name });
        await startStreamingData(currentDevice).then(() => {
          sendCommand('stt config show');
          setIsDisabled(false);
        });
      }
    };
    initFn();
  }, []);
  useEffect(() => {
    if (ChesterData.match(/\d+/g) && ChesterData.includes('measure-interval')) {
      const regex = /\d+/g;
      const numbers = ChesterData.match(regex);
      setMeasureValue(numbers[0]);
      setSendValue(numbers[1]);
    }
  }, [ChesterData]);
  useEffect(() => {
    if (!currentDevice) {
      console.log('Disconnected');
      navigation.goBack();
    }
  }, [currentDevice]);

  const handleRtcSave = () => {
    const dateRegex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    if (dateRegex.test(currentTime)) {
      sendCommand('rtc set ' + currentTime);
      setModalRTCVisible(false);
      notificationSuccess('RTC time updated to ' + currentTime);
    } else {
      notificationError('Invalid date format');
    }
  };
  const handleShowRTCmodal = () => {
    const now = new Date();
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');
    const day = now.getUTCDate().toString().padStart(2, '0');
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = now.getUTCFullYear();
    setCurrentTime(
      year +
        '/' +
        month +
        '/' +
        day +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds,
    );
    setModalRTCVisible(true);
  };

  const handleSave = () => {
    sendCommand('stt config measure-interval ' + parseInt(measureValue));
    sendCommand('stt config send-interval ' + parseInt(sendValue));
    sendCommand('config save');
    setModalVisible(false);
    notificationSuccess('Configuration saved');
    Alert.alert('Success', 'Device is being restarted to apply changes');
    navigation.goBack();
  };

  return (
    <>
      <Indicator active={isActive} />
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            onPress={() => {
              sendCommand('stt measure');
              navigation.navigate('Terminal');
            }}
            disabled={isDisabled}>
            <Text style={styles.buttonTitle}>Measure</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={async () => {
              setModalVisible(true);
            }}
            disabled={isDisabled}>
            <Text style={styles.buttonTitle}>Config</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('FwScreen')}
            disabled={isDisabled}>
            <Text style={styles.buttonTitle}>Firmware</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { marginTop: 25 }]}
            onPress={() => handleShowRTCmodal()}
            disabled={isDisabled}>
            <Text style={styles.buttonTitle}>Set RTC</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { marginTop: 25 }]}
            onPress={() => navigation.navigate('Terminal')}
            disabled={isDisabled}>
            <Text style={styles.buttonTitle}>Terminal</Text>
          </Pressable>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[
                      styles.modalText,
                      { borderWidth: 0, fontSize: 15, width: '60%' },
                    ]}>
                    Measure interval [s]:
                  </Text>
                  <TextInput
                    onChangeText={text => setMeasureValue(text)}
                    keyboardType="numeric"
                    style={styles.modalText}>
                    {measureValue}
                  </TextInput>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[
                      styles.modalText,
                      { borderWidth: 0, fontSize: 15, width: '60%' },
                    ]}>
                    Send interval [s]:
                  </Text>
                  <TextInput
                    onChangeText={text => setSendValue(text)}
                    keyboardType="numeric"
                    style={styles.modalText}>
                    {sendValue}
                  </TextInput>
                </View>
              </View>

              <View style={styles.btnContainer}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => handleSave()}>
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalRTCVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                onChangeText={text => setCurrentTime(text)}
                style={[styles.modalText, { width: '100%' }]}>
                {currentTime}
              </TextInput>
              <View style={styles.btnContainer}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalRTCVisible(false)}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => handleRtcSave()}>
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Icon name="info-outline" size={20} color="#fff" />
                <Text style={{ fontSize: 12, marginLeft: 5, color: 'white' }}>
                  Format: YYYY/MM/DD HH:MM:SS
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#252526',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#8B0000',
    marginLeft: 20,
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    color: 'white',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    fontFamily: 'Poppins-Medium',
    marginBottom: 15,
    textAlign: 'center',
    width: 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#252526',
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#fff',
  },
  buttons: {
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '91%',
    alignContent: 'stretch',
  },
  scrollView: {
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    width: '91%',
    height: '89%',
    backgroundColor: '#353535',
    padding: 10,
    flexGrow: 0,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#8B0000',
    borderRadius: 8,
    height: 50,
    width: 100,
    justifyContent: 'center',
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Poppins-Medium',
  },
  form: {
    alignItems: 'center',
    backgroundColor: '#353535',
    borderRadius: 8,
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 16,
    width: '100%',
    flex: 1,
    flexGrow: 1,
    marginRight: 10,
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 15,
    width: '100%',
    fontFamily: 'Poppins-Medium',
    backgroundColor: '#353535',
  },
  sendCommandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '91%',
    marginBottom: 10,
  },
});

export default chesterBleScreen;
