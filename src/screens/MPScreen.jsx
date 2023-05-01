import { useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import Indicator from '../components/activityIndicator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import apiClientContext from '../api/apiClient';

const MPScreen = ({ route, navigation }) => {
  const { MPs, fetchMPs, isActive } = apiClientContext();
  useEffect(() => {
    fetchMPs(route.params?.compId, route.params?.consId);
  }, []);

  const goToDevice = MP => {
    trigger('impactLight', {
      ignoreAndroidSystemSettings: false,
      enableVibrateFallback: true,
    });
    navigation.navigate('DeviceInfo', {
      consId: route.params.conId,
      compId: route.params.compId,
      MP: MP,
    });
  };
  return (
    <>
      <Indicator active={isActive} />
      <ScrollView scrollEnabled={true} style={styles.scrollView}>
        <View style={styles.container}>
          {MPs !== null ? (
            MPs.map(MP => {
              return (
                <Pressable
                  key={MP.mpId}
                  style={styles.button}
                  onPress={() => goToDevice(MP)}>
                  <Text style={styles.text}>{MP.mpName}</Text>
                  <Icon name="navigate-next" size={30} color="#fff" />
                </Pressable>
              );
            })
          ) : (
            <Indicator active={true} />
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    backgroundColor: '#252526',
    height: '100%',
  },
  button: {
    backgroundColor: '#8b0000',
    color: '#fff',
    width: '90%',
    height: 'auto',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    padding: 15,
    width: '90%',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  scrollView: {
    backgroundColor: '#252526',
    height: '100%',
  },
});
export default MPScreen;
