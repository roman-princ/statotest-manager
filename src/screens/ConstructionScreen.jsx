import { useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import Icon from 'react-native-vector-icons/MaterialIcons';
import apiClientContext from '../api/apiClient';
import Indicator from '../components/activityIndicator';

const ConstructionScreen = ({ route, navigation }) => {
  const { constructions, fetchConstructions, isActive } = apiClientContext();
  useEffect(() => {
    fetchConstructions(route.params?.id);
  }, []);

  const goToMP = consId => {
    trigger('impactLight', {
      ignoreAndroidSystemSettings: false,
      enableVibrateFallback: true,
    });
    navigation.navigate('MP', { consId: consId, compId: route.params?.id });
  };
  return (
    <>
      <Indicator active={isActive} />
      <ScrollView scrollEnabled={true} style={styles.scrollView}>
        <View style={styles.container}>
          {constructions &&
            constructions.map(construction => {
              return (
                <Pressable
                  key={construction.consId}
                  style={styles.button}
                  onPress={() => goToMP(construction.consId)}>
                  <Text style={styles.text}>{construction.consName}</Text>
                  <Icon name="navigate-next" size={30} color="#fff" />
                </Pressable>
              );
            })}
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
export default ConstructionScreen;
