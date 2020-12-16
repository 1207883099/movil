import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

export function GenerarTareaEmpleado({Cuadrillas}) {
  const [IsCuadrilla, setIsCuadrilla] = useState('');
  const [Empleados, setEmpleados] = useState([]);

  useEffect(() => {
    if (Cuadrillas) {
      if (Cuadrillas.length > 1) {
        setIsCuadrilla('');
      } else {
        setIsCuadrilla(Cuadrillas[0].Nombre);
        setEmpleados(Cuadrillas[0].Empleados);
      }
    }
  }, [Cuadrillas]);

  return (
    <>
      {console.log(Empleados)}
      {Cuadrillas.length > 1 ? (
        <>
          <Text style={[styles.label, {textAlign: 'center'}]}>
            Seleccione la cuadrilla
          </Text>

          <View style={styles.select}>
            <Picker
              selectedValue={IsCuadrilla}
              onValueChange={(itemValue) => {
                if (itemValue !== 'none') {
                  setIsCuadrilla(itemValue);
                  const ResultEmpleados = Cuadrillas.find(
                    (cuadrilla) => cuadrilla.Nombre === itemValue,
                  );
                  setEmpleados(ResultEmpleados.Empleados);
                }
              }}>
              <Picker.Item label="** Seleccione la cuadrilla **" value="none" />
              {Cuadrillas.map((cuadrilla, index) => (
                <Picker.Item
                  key={index}
                  label={cuadrilla.Nombre}
                  value={cuadrilla.Nombre}
                />
              ))}
            </Picker>
          </View>
        </>
      ) : (
        ''
      )}
    </>
  );
}

const styles = StyleSheet.create({
  select: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cdcdcd',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: 15,
  },
});
