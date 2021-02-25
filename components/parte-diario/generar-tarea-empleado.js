import React, {useState, useEffect} from 'react';
import EmpleadosAsignados from './empleados-asginados';
import {Text, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
/* DB LOCAL */
import {dbIteracionPT} from '../../db-local/db-interacion-pt';

export function GenerarTareaEmpleado({
  Cuadrillas,
  id_parte_diario,
  idSector,
  setIsReload,
}) {
  const [IsCuadrilla, setIsCuadrilla] = useState('');
  const [Empleados, setEmpleados] = useState([]);
  const [dataSecuencia, setDateSecuencia] = useState({
    IdCuadrilla: undefined,
    iteracion: undefined,
    secuencia: undefined,
  });

  useEffect(() => {
    if (Cuadrillas) {
      if (Cuadrillas.length > 1) {
        setIsCuadrilla('');
        setEmpleados([]);
      } else {
        setIsCuadrilla(Cuadrillas[0].Nombre);
        setEmpleados(Cuadrillas[0].Empleados);
        const IdCuadrillaSrt = addCeroCuadrilla(`${Cuadrillas[0].IdCuadrilla}`);
        const IdCuadrilla = Cuadrillas[0].IdCuadrilla;

        validarIteracion(IdCuadrilla, IdCuadrillaSrt);
      }
    }
  }, [Cuadrillas]);

  const validarIteracion = (IdCuadrilla, IdCuadrillaSrt) => {
    dbIteracionPT.find({IdCuadrilla}, async function (err, dataIteracion) {
      err && Alert.alert(err.message);

      if (dataIteracion.length) {
        const IntReverce = dataIteracion.reverse();
        const secuencia = `8${IdCuadrillaSrt}${IntReverce[0].iteracion + 1}`;
        const iteracion = IntReverce[0].iteracion + 1;

        setDateSecuencia({IdCuadrilla, iteracion, secuencia});
      } else {
        if (Cuadrillas[0].secuencialpartediario) {
          const secuencia = `8${IdCuadrillaSrt}${
            Cuadrillas[0].secuencialpartediario + 1
          }`;
          const iteracion = Cuadrillas[0].secuenciapartediario + 1;

          setDateSecuencia({IdCuadrilla, iteracion, secuencia});
        } else {
          setDateSecuencia({
            IdCuadrilla,
            iteracion: 1,
            secuencia: `8${IdCuadrillaSrt}1`,
          });
        }
      }
    });
  };

  const addCeroCuadrilla = (IdCuadrilla) => {
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
                  const IdCuadrillaSrt = addCeroCuadrilla(
                    `${ResultEmpleados.IdCuadrilla}`,
                  );
                  const IdCuadrilla = ResultEmpleados.IdCuadrilla;

                  validarIteracion(IdCuadrilla, IdCuadrillaSrt);
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
          dataSecuencia={dataSecuencia}
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
