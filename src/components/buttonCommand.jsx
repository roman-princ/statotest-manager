import { Pressable, Text, StyleSheet, View } from 'react-native';
import useBleContext from '../ble/useBLE';
import { trigger } from 'react-native-haptic-feedback';
const ButtonDarkRed = ({ text, args, disabled }) => {
  const { sendCommand } = useBleContext();
  return (
    <View>
      <Pressable
        style={styles.button}
        onPress={() => {
          trigger('impactLight');
          sendCommand(args);
        }}
        disabled={!!disabled}>
        <Text style={styles.buttonTitle}>{text}</Text>
      </Pressable>
    </View>
  );
};

export default ButtonDarkRed;
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#8B0000',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    width: 100,
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    fontFamily: 'Poppins-Medium',
  },
});
