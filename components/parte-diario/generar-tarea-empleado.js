import React, {useState, useEffect} from 'react';
import EmpleadosAsignados from './empleados-asginados';
import {Text, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

export function GenerarTareaEmpleado({
  Cuadrillas,
  id_parte_diario,
  idSector,
  setIsReload,
}) {
  const [IsCuadrilla, setIsCuadrilla] = useState('');
  const [Empleados, setEmpleados] = useState([]);
  const [secuencia, setSecuencia] = useState('00001');

  useEffect(() => {
    if (Cuadrillas) {
      if (Cuadrillas.length > 1) {
        setIsCuadrilla('');
        setEmpleados([]);
      } else {
        setIsCuadrilla(Cuadrillas[0].Nombre);
        setEmpleados(Cuadrillas[0].Empleados);
        const IdCuadrilla = addCero(`${Cuadrillas[0].IdCuadrilla}`);

        if (Cuadrillas[0].secuenciapartediario) {
          setSecuencia(
            `8${IdCuadrilla}${Cuadrillas[0].secuenciapartediario + 1}`,
          );
        } else {
          setSecuencia(`8${IdCuadrilla}00001`);
        }
      }
    }
  }, [Cuadrillas]);

  const addCero = (IdCuadrilla) => {
    switch (IdCuadrilla.length) {
      case 1:
        return `00${IdCuadrilla}`;
      case 2:
        return `0${IdCuadrilla}`;
      default:
        return IdCuadrilla;
    }
  };

  return (
    <>
      {Empleados.length === 0 ? (
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
                  const IdCuadrilla = addCero(`${ResultEmpleados.IdCuadrilla}`);

                  if (ResultEmpleados.secuenciapartediario) {
                    setSecuencia(
                      `8${IdCuadrilla}${
                        ResultEmpleados.secuenciapartediario + 1
                      }`,
                    );
                  } else {
                    setSecuencia(`8${IdCuadrilla}00001`);
                  }
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
        <EmpleadosAsignados
          Empleados={Empleados}
          secuencia={secuencia}
          actions={false}
          id_parte_diario={id_parte_diario}
          cuadrilla={IsCuadrilla}
          idSector={idSector}
          setIsReload={setIsReload}
        />
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
