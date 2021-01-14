import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {suma_resta_fecha, primerDiaSemana, getDia} from '../../hooks/fechas';

export function SelectDia({setSelectDay, setFechaCtx}) {
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    const dataFechas = [];
    for (let i = 1; i <= 7; i++) {
      const label = suma_resta_fecha(primerDiaSemana(), +i);
      dataFechas.push({label: getDia(label), value: label.toDateString()});
    }
    setFechas(dataFechas);
  }, []);

  return (
    <>
      <Text style={styles.label}>Esta semana:</Text>
      <View style={styles.select}>
        <Picker
          selectedValue={fechas}
          onValueChange={(itemValue) => {
            if (itemValue) {
              setFechaCtx(itemValue);
              setSelectDay(false);
            }
          }}>
          <Picker.Item label="** Selecciona **" value="" />
          {fechas.map((fecha, index) => (
            <Picker.Item key={index} label={fecha.label} value={fecha.value} />
          ))}
        </Picker>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  select: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#fff',
    borderColor: '#fff',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    paddingBottom: 15,
    color: '#fff',
  },
});
