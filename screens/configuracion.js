import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Configuracion = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.button}>
          <Text style={styles.subTitle}>Configuracion</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => console.log('efe')}>
            <LinearGradient
              colors={['#0993B5', '#C7C7C7']}
              style={styles.signIn}>
              <Text style={[styles.text, {color: '#fff'}]}>
                Anonimo por ahora
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => console.log('efe')}>
            <LinearGradient
              colors={['#0993B5', '#C7C7C7']}
              style={styles.signIn}>
              <Text style={[styles.text, {color: '#fff'}]}>
                Anonimo por ahora
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => console.log('efe')}>
            <LinearGradient
              colors={['#0993B5', '#C7C7C7']}
              style={styles.signIn}>
              <Text style={[styles.text, {color: '#fff'}]}>
                Anonimo por ahora
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => console.log('efe')}>
            <LinearGradient
              colors={['#0993B5', '#C7C7C7']}
              style={styles.signIn}>
              <Text style={[styles.text, {color: '#fff'}]}>
                Anonimo por ahora
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => console.log('efe')}>
            <LinearGradient
              colors={['#0993B5', '#C7C7C7']}
              style={styles.signIn}>
              <Text style={[styles.text, {color: '#fff'}]}>
                Anonimo por ahora
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Configuracion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  item: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  signIn: {
    width: '100%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    padding: 10,
  },
});
