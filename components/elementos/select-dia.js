import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {suma_resta_fecha, primerDiaSemana, getDia} from '../../hooks/fechas';

export function SelectDia({setSelectDay}) {
  const [itemFechas, setItemFechas] = useState();
  const [fechas, setFechas] = useState([]);
  const [change, setChange] = useState(0);

  useEffect(() => {
    const dataFechas = [];
    for (let i = 0; i < 7; i++) {
      const g = suma_resta_fecha(new Date(primerDiaSemana()), +i);
      dataFechas.push({label: getDia(g), value: String(g)});
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
            if (itemValue && change > 0) {
              setItemFechas(itemValue);
              setSelectDay(false);
            } else {
              setChange(change + 1);
            }
          }}>
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
