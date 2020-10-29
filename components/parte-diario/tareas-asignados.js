import React, {useEffect, useState} from 'react';
import {insertar, db} from '../../db-local/config-db-local';
import {Picker} from '@react-native-picker/picker';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
} from 'react-native';

export function TareasAsginados({thisEmpleado}) {
  const [selectActividades, setSelectActividades] = useState(0);
  const [selectLote, setSelectLote] = useState(0);

  const [Actividades, setActividades] = useState([]);
  const [Lotes, setLotes] = useState([]);
  const [Cuadrillas, setCuadrillas] = useState([]);
  const [MisPartesDiarios, setMisPartesDiarios] = useState([]);

  useEffect(() => {
    try {
      const fetchDB = () => {
        db.find({}, async function (err, docs) {
          if (err) {
            Alert.alert(err.message);
          }
          docs.map((dataBase, index) => {
            docs[index].Actividades && setActividades(docs[index].Actividades);
            docs[index].Lotes && setLotes(docs[index].Lotes);
            docs[index].My_Cuadrilla && setCuadrillas(docs[index].My_Cuadrilla);
            docs[index].Mis_Parte_Diario &&
              setMisPartesDiarios(docs[index].Mis_Parte_Diario);
          });
        });
      };

      fetchDB();
    } catch (error) {
      Alert.alert(error.message);
    }
  }, [db]);

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

  return (
    <>
      <Text style={([styles.label], {textAlign: 'center', marginBottom: 10})}>
        {obtener_empleado(thisEmpleado)}
      </Text>
      <ScrollView>
        {MisPartesDiarios.map((mis_parte_diario) =>
          mis_parte_diario.labores.map((labores) =>
            labores.Asignado.filter(
              (asig) => asig.Empleado === thisEmpleado,
            ).map((asig) =>
              asig.tareas.map((tarea) => (
                <View style={styles.box_tareas}>
                  <View style={styles.row_tareas}>
                    <Text style={styles.tarea_text}>Actividad:</Text>

                    <View style={styles.select}>
                      <Picker
                        selectedValue={selectActividades}
                        onValueChange={(itemValue) =>
                          setSelectActividades(itemValue)
                        }>
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
                      style={styles.text_input}
                      placeholder="Inserta la URL autorizada"
                    />
                  </View>

                  <View style={styles.row_tareas}>
                    <Text style={styles.tarea_text}>Lote:</Text>

                    <View style={styles.select}>
                      <Picker
                        selectedValue={selectLote}
                        onValueChange={(itemValue) => setSelectLote(itemValue)}>
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
              )),
            ),
          ),
        )}

        <TextInput
          style={[styles.text_input, {height: 60, marginBottom: 20}]}
          placeholder="Escriba las observaciones: (opcional)"
        />

        <Button title="Guardar Tareas" color="#009387" />
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
    shadowColor: '#cdcdcd',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.43,
    shadowRadius: 7.51,
    elevation: 3,
  },
});
