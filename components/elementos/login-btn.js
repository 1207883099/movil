import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export function LoginBtn({navigation}) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('SplashScreen', {login: true})}
      style={[
        styles.signIn,
        {borderColor: '#009387', borderWidth: 1, marginTop: 15},
      ]}>
      <Text style={[styles.textSign, {color: '#009387'}]}>Iniciar sesion</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  signIn: {
    width: '90%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
