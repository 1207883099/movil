import React from 'react';
import {View, Text} from 'react-native';
import {get_Semana_Del_Ano, getDia} from '../../hooks/fechas';

export function FechaTrabajo() {
  return (
    <>
      <View style={{backgroundColor: '#06ab9d', padding: 5}}>
        <Text style={{color: '#000', fontSize: 17, textAlign: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>{getDia()} </Text>
          de la semana:{' '}
          <Text style={{fontWeight: 'bold'}}>
            {get_Semana_Del_Ano()}
          </Text> del{' '}
          <Text style={{fontWeight: 'bold'}}>{new Date().getFullYear()}</Text>
        </Text>
      </View>
    </>
  );
}
