import React, {useState} from 'react';
import {SelectDia} from './select-dia';
import {View, Text} from 'react-native';
import {get_Semana_Del_Ano, getDia} from '../../hooks/fechas';

export function FechaTrabajo() {
  const [selectDay, setSelectDay] = useState(false);
  return (
    <>
      <View style={{backgroundColor: '#06ab9d', padding: 5}}>
        <Text style={{color: '#000', fontSize: 17, textAlign: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>{getDia(new Date())} </Text>
          de la semana:{' '}
          <Text style={{fontWeight: 'bold'}}>
            {get_Semana_Del_Ano()}
          </Text> del{' '}
          <Text style={{fontWeight: 'bold'}}>{new Date().getFullYear()}</Text>
        </Text>
        {selectDay ? (
          <SelectDia setSelectDay={setSelectDay} />
        ) : (
          <Text
            style={{color: '#fff', marginTop: 10, textAlign: 'center'}}
            onPress={() => setSelectDay(!selectDay)}>
            Seleccionar otro dia
          </Text>
        )}
      </View>
    </>
  );
}
