import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import useBleContext from '../ble/useBLE';
import ButtonDarkRed from '../components/buttonCommand';
import useCurrentDevice from '../ble/currentDevice';

const terminalScreen = ({ navigation }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const { ChesterData } = useBleContext();
  const { currentDevice } = useCurrentDevice();
  const [command, setCommand] = useState('');
  useEffect(() => {
    const asyncFn = async () => {
      if (currentDevice) {
        navigation.setOptions({ title: currentDevice.name });
        setIsDisabled(false);
      }
    };
    asyncFn();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}>{ChesterData}</Text>
      </ScrollView>
      <Pressable style={styles.sendCommandContainer}>
        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            placeholder="Command..."
            placeholderTextColor={'rgba(235, 235, 245, 0.6)'}
            autoCorrect={false}
            onChangeText={text => setCommand(text)}
            keyboardType="default"
            returnKeyType="next"
            placeholderFontFamily="Poppins-Medium"
            style={styles.textInput}
            textContentType="none"
          />
        </View>
        <ButtonDarkRed text="Send" args={command} disabled={isDisabled} />
      </Pressable>
    </View>
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
  buttons: {
    marginTop: 10,
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

export default terminalScreen;
