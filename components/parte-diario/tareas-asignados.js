import React, {useEffect, useState} from 'react';
import {dbMaestra} from '../../db-local/db-maestra';
import {Picker} from '@react-native-picker/picker';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  Alert,
} from 'react-native';

export function TareasAsginados({thisEmpleado, setIsReload, setIsModal}) {
  const [selectActividades, setSelectActividades] = useState([]);
  const [selectLote, setSelectLote] = useState(0);
  const [hectarea, setHectarea] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [Actividades, setActividades] = useState([]);
  const [Lotes, setLotes] = useState([]);
  const [Cuadrillas, setCuadrillas] = useState([]);
  const [MisPartesDiarios, setMisPartesDiarios] = useState([]);

  useEffect(() => {
    try {
      const fetchDbMaestra = () => {
        dbMaestra.find({}, async function (err, docs) {
          if (err) {
            Alert.alert(err.message);
          }
          docs.map((dataBase, index) => {
            setActividades(docs[0].Actividades);
            setLotes(docs[0].Lotes);
            setCuadrillas(docs[0].My_Cuadrilla);
            docs[index].Mis_Parte_Diario &&
              setMisPartesDiarios(docs[index].Mis_Parte_Diario);
          });
        });
      };

      fetchDbMaestra();
    } catch (error) {
      Alert.alert(error.message);
    }
  }, []);

  const obtener_empleado = (IdEmpleado) => {
    return Cuadrillas.map((cuadrilla, index) => {
      const result_empleado = Cuadrillas[index].Empleados.find(
        (empleado) => empleado.IdEmpleado === IdEmpleado,
      );
      if (result_empleado) {
        return result_empleado.Nombre + ' - ' + result_empleado.Apellido;
      }
    });
  };

  const guardar_tareas = () => {
    if (selectActividades && selectLote) {
      let Asignado = [
        {
          Empleado: thisEmpleado,
          observacion: observaciones,
          tareas: [
            {
              Actividad: selectActividades,
              Hectarea: hectarea,
              Lote: selectLote,
            },
          ],
        },
      ];

      setIsReload(true);
      setIsModal(false);
    } else {
      Alert.alert('Llene la terea primero antes de guardarla.');
    }
  };

  return (
    <>
      {console.log(selectActividades.reverse())}
      <Text style={([styles.label], {textAlign: 'center', marginBottom: 10})}>
        {obtener_empleado(thisEmpleado)}
      </Text>
      <ScrollView>
        {MisPartesDiarios.map((mis_parte_diario) =>
          mis_parte_diario.labores.map((labores) =>
            labores.Asignado.filter(
              (asig) => asig.Empleado == thisEmpleado,
            ).map(
              (asig) =>
                asig.tareas.map((tarea, index) => (
                  <>
                    <View style={styles.box_tareas}>
                      <View style={styles.row_tareas}>
                        <Text style={styles.tarea_text}>Actividad:</Text>

                        <View style={styles.select}>
                          <Picker
                            selectedValue={selectActividades}
                            onValueChange={(itemValue) => {
                              selectActividades.splice(index, 1);
                              setSelectActividades(
                                selectActividades.length
                                  ? [
                                      ...selectActividades,
                                      {index, idActividad: itemValue},
                                    ]
                                  : [{index, idActividad: itemValue}],
                              );
                            }}>
                            {Actividades.map((actividad, index) => (
                              <Picker.Item
                                key={index}
                                label={actividad.Nombre}
                                value={actividad.IdActividad}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>

                      <View style={styles.row_tareas}>
                        <Text style={styles.tarea_text}>Hectaria:</Text>
                        <TextInput
                          defaultValue={tarea.Actividad}
                          onChangeText={(value) => setHectarea(value)}
                          style={styles.text_input}
                          placeholder="Inserta hectareas"
                        />
                      </View>

                      <View style={styles.row_tareas}>
                        <Text style={styles.tarea_text}>Lote:</Text>

                        <View style={styles.select}>
                          <Picker
                            selectedValue={selectLote}
                            onValueChange={(itemValue) =>
                              setSelectLote(itemValue)
                            }>
                            {Lotes.map((lote, index) => (
                              <Picker.Item
                                key={index}
                                label={lote.Nombre}
                                value={lote.IdLote}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    </View>
                  </>
                )),
              <TextInput
                style={[styles.text_input, {height: 60, marginBottom: 20}]}
                placeholder="Escriba las observaciones: (opcional)"
                onChangeText={(value) => setObservaciones(value)}
              />,
            ),
          ),
        )}

        <Button
          title="Guardar Tareas"
          color="#009387"
          onPress={guardar_tareas}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  box_tareas: {
    borderWidth: 2,
    borderColor: '#696969',
    padding: 10,
    marginBottom: 25,
    marginTop: 20,
  },
  tarea_text: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  text_input: {
    borderWidth: 2,
    borderColor: '#cdcdcd',
    padding: 5,
    borderRadius: 10,
  },
  select: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cdcdcd',
    marginBottom: 10,
  },
  row_tareas: {
    padding: 10,
  },
});
