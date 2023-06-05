import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import useBleContext from '../ble/useBLE';
import { useEffect } from 'react';
import useFile from '../fwupdate/useFile';
import useFwUpdate from '../fwupdate/useFwUpdate';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UpgradeMode } from '@playerdata/react-native-mcu-manager';
import SizedBox from '../components/sizedBox';
import { Bar } from 'react-native-progress';
import Indicator from '../components/activityIndicator';
import useCurrentDevice from '../ble/currentDevice';

const fwScreen = ({ navigation }) => {
  const { pickFile, file } = useFile();
  const { sendCommand, ChesterData } = useBleContext();
  const { currentDevice } = useCurrentDevice();
  const { cancelUpdate, runUpdate, progress, state, deleteImage, isActive } =
    useFwUpdate(
      currentDevice.id,
      file?.uri || null,
      UpgradeMode.TEST_AND_CONFIRM,
    );
  useEffect(() => {
    if (currentDevice) {
      navigation.setOptions({ title: currentDevice.name });
      sendCommand('mcuboot');
    } else {
      navigation.goBack();
    }
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Indicator active={isActive} />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}>{ChesterData}</Text>
        <SizedBox height={30} />
      </ScrollView>
      <Pressable
        onPress={() => pickFile()}
        style={{
          width: '91%',
          marginBottom: 10,
          display: state === 'UPLOAD' ? 'none' : 'flex',
        }}>
        <View style={styles.uploadButton}>
          <Icon name="file-upload" size={30} color="#FFFFFF" />
          <Text style={styles.buttonTitle}>
            {file ? file.name : 'Pick a file'}
          </Text>
        </View>
      </Pressable>
      <SafeAreaView
        style={[
          styles.buttonsView,
          { display: state === 'UPLOAD' ? 'none' : 'flex' },
        ]}>
        <Pressable
          onPress={() => runUpdate()}
          style={{ width: '45%', marginRight: 10 }}
          disabled={file ? false : true}>
          <View style={styles.uploadButton}>
            <Icon
              name="cloud-upload"
              size={30}
              color="#FFFFFF"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.buttonTitle}>Upload</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => deleteImage()}
          style={{ width: '50%' }}
          disabled={file ? false : true}>
          <View style={styles.uploadButton}>
            <Icon
              name="delete-outline"
              size={30}
              color="#FFFFFF"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.buttonTitle}>Erase Image</Text>
          </View>
        </Pressable>
      </SafeAreaView>

      <SafeAreaView
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          alignItems: 'center',
          height: '100%',
          marginBottom: 10,
          opacity: state === 'UPLOAD' ? 100 : 0,
        }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Bar progress={progress / 100} width={200} color="#8B0000" />
          <Text style={[styles.text, { marginLeft: 10 }]}>{progress}%</Text>
        </View>
        <Pressable
          onPress={() => cancelUpdate()}
          style={{ width: '30%', height: 5 }}
          disabled={file ? false : true}>
          <View style={styles.uploadButton}>
            <Icon
              name="close"
              size={30}
              color="#FFFFFF"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.buttonTitle}>Cancel</Text>
          </View>
        </Pressable>
      </SafeAreaView>
      <Text
        style={[
          styles.text,
          { opacity: state === 'UPLOAD' || state === 'RESET' ? 100 : 0 },
        ]}>
        State: {state}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  scrollView: {
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    width: '91%',
    height: '60%',
    backgroundColor: '#353535',
    padding: 10,
    flexGrow: 0,
  },
  uploadButton: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#8B0000',
    borderRadius: 8,
    padding: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    fontFamily: 'Poppins-Medium',
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    width: '100%',
  },
  buttonsView: {
    flexDirection: 'row',
    width: '91%',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 5,
  },
});
export default fwScreen;
