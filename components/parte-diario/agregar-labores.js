import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import {db} from '../../db-local/config-db-local';
import {MessageAlert} from '../pequenos/message';

export function AgregarLabores({
  setLaboresAsignado,
  LaboresAsignado,
  setIsModal,
}) {
  const [Labores, setLabores] = useState([]);
  const [Cuadrillas, setCuadrillas] = useState([]);
  const [Empleados, setEmpleados] = useState([]);
  const [SelectEmpleado, setSelectEmpleado] = useState(null);

  const [Labor, setLabor] = useState('');
  const [IsCuadrilla, setIsCuadrilla] = useState('');
  const [Asignado, setAsignado] = useState([]);

  useEffect(() => {
    try {
      const fetchDB = () => {
        db.find({}, async function (err, docs) {
          if (err) {
            Alert.alert(err.message);
          }
          setLabores(docs[0].Labores);
          setCuadrillas(docs[0].My_Cuadrilla);

          if (docs[0].My_Cuadrilla.length > 1) {
            setIsCuadrilla('');
          } else {
            setIsCuadrilla(docs[0].My_Cuadrilla[0].Nombre);
            setEmpleados(docs[0].My_Cuadrilla[0].Empleados);
          }
        });
      };

      fetchDB();
    } catch (error) {
      Alert.alert(error.message);
    }
  }, [db]);

  const obtener_labor = (IdLabor) => {
    const resul_labor = Labores.find((labor) => labor.IdLabor === IdLabor);
    return resul_labor.Nombre;
  };

  const obtener_empleado = (IdEmpleado) => {
    const result_empleado = Empleados.find(
      (empleado) => empleado.IdEmpleado === IdEmpleado,
    );
    return result_empleado.Nombre;
  };

  const obtener_empleado_asignado = (IdEmpleado) => {
    const result = Asignado.find((asig) => asig.Empleado == IdEmpleado);
    return result;
  };

  const obtener_labores_asignados = (IdLabor) => {
    return LaboresAsignado.find((labor) => labor.labor === IdLabor);
  };

  const guardar_integrantes = () => {
    if (SelectEmpleado && Labor) {
      if (obtener_labores_asignados(Labor) == undefined) {
        if (obtener_empleado_asignado(SelectEmpleado) == undefined) {
          const tareas = [
            {
              Actividad: 'ningino',
              Hectarea: 'ninguno',
              Lote: 'ninguno',
            },
          ];
          const asig = [];
          asig.push({Empleado: SelectEmpleado, tareas, observacion: 'ninguno'});

          setAsignado([...Asignado, ...asig]);
          Alert.alert(`${obtener_empleado(SelectEmpleado)} fue guardado.`);
        } else {
          Alert.alert(
            `${obtener_empleado(
              SelectEmpleado,
            )} ya fue guardado anteriormente.`,
          );
        }
      } else {
        Alert.alert(
          `La labor: ( ${obtener_labor(Labor)} ) ya fue asignada anteriomente`,
        );
      }
    } else {
      Alert.alert(
        `Seleccione algun empleado de su cuadrilla: ( ${IsCuadrilla} )`,
      );
    }
  };

  const finalizar_asignaciones = () => {
    const labores = {
      labor: Labor,
      Asignado: Asignado,
    };

    setLaboresAsignado([...LaboresAsignado, ...[labores]]);

    console.log([...LaboresAsignado, ...[labores]]);
    setIsModal(false);
  };

  return (
    <>
      <Text style={styles.modalText}>Selecciona los datos necesarios.</Text>

      {SelectEmpleado === null && (
        <>
          <Text style={styles.label}>Labores:</Text>
          <View style={styles.select}>
            <Picker
              selectedValue={Labor}
              onValueChange={(itemValue) => {
                if (obtener_labores_asignados(itemValue) == undefined) {
                  setLabor(itemValue);
                } else {
                  Alert.alert(
                    `La labor: ( ${obtener_labor(
                      itemValue,
                    )} ) ya fue asignada anteriomente`,
                  );
                }
              }}>
              {Labores.map((labor, index) => (
                <Picker.Item
                  key={index}
                  label={labor.Nombre}
                  value={labor.IdLabor}
                />
              ))}
            </Picker>
          </View>
        </>
      )}

      {IsCuadrilla ? (
        <>
          <Text style={styles.label}>Mi cuadrilla: ( {IsCuadrilla} )</Text>

          <View style={styles.select}>
            <Picker
              selectedValue={SelectEmpleado}
              onValueChange={(itemValue) => setSelectEmpleado(itemValue)}>
              {Empleados.map((empleado, index) => (
                <Picker.Item
                  key={index}
                  label={empleado.Nombre + ' - ' + empleado.Apellido}
                  value={empleado.IdEmpleado}
                />
              ))}
            </Picker>
          </View>
        </>
      ) : (
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
      )}

      {false && <MessageAlert background="#cdcdcd" content="cosa" />}

      {SelectEmpleado && (
        <Button
          title={`Guarda obrero en: ( ${obtener_labor(Labor)} )`}
          onPress={guardar_integrantes}
        />
      )}
      <Text>{'\n'}</Text>
      {Asignado.length > 0 && (
        <Button
          style={{marginTop: 20}}
          color="green"
          title={`Finalizar asignaciones`}
          onPress={finalizar_asignaciones}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
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
