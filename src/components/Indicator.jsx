import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Indicator = ({ active }) => {
  return (
    active && (
      <View
        style={{
          ...StyleSheet.absoluteFill,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
        <ActivityIndicator
          color="#8b0000"
          size={'large'}
          style={[styles.loadingcircle, { zIndex: 1000 }]}
        />
      </View>
    )
  );
};
export default Indicator;
const styles = StyleSheet.create({
  loadingcircle: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 15,
  },
  loadingcircleView: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
