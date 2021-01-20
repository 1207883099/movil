/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {SelectDia} from './select-dia';
import {View, Text} from 'react-native';

export function FechaTrabajo({fechaCtx, setFechaCtx, semana, year}) {
  const [selectDay, setSelectDay] = useState(false);

  return (
    <>
      <View style={{backgroundColor: '#06ab9d', padding: 5}}>
        <Text style={{color: '#000', fontSize: 17, textAlign: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>{fechaCtx} </Text>
          de la semana: <Text style={{fontWeight: 'bold'}}>
            {semana}
          </Text> del <Text style={{fontWeight: 'bold'}}>{year}</Text>
        </Text>
        {selectDay ? (
          <SelectDia setSelectDay={setSelectDay} setFechaCtx={setFechaCtx} />
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
