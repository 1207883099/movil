import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Button, Alert} from 'react-native';
import {ModalScreen} from '../modal/modal';
import {Picker} from '@react-native-picker/picker';
/* DB LOCAL */
import {InsertarActividadEmpleado} from '../../db-local/db-actividades-empleado';
import {dbMaestra} from '../../db-local/db-maestra';

export function AddActividad({id_parte_diario, cuadrilla, setIsReload}) {
  const [isModal, setIsModal] = useState(false);
  const [empleado, setEmpleado] = useState();
  const [labor, setLabor] = useState();
  const [actividad, setActividad] = useState();
  ///////////////////
  const [labores, setLabores] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);

      setLabores(dataMaestra[0].Labores);
      setActividades(dataMaestra[0].Actividades);
      setEmpleados(
        dataMaestra[0].My_Cuadrilla.find((item) => item.Nombre === cuadrilla)
          .Empleados,
      );
    });
  }, [cuadrilla]);

  const anadirActividad = () => {
    if (empleado && labor && actividad) {
      console.group(empleado, labor, actividad);
      InsertarActividadEmpleado({
        idEmpleado: empleado,
        idParteDiario: id_parte_diario,
        actividad: actividad,
      });
      setIsReload(true);
      setIsModal(false);
    } else {
      Alert.alert('Campos vacios, revise y vuelve a intentar');
    }
  };

  return (
    <>
      <Text
        style={[styles.label, styles.box_add_actividad]}
        onPress={() => setIsModal(true)}>
        Añadir otro
      </Text>

      <ModalScreen isModal={isModal} setIsModal={setIsModal}>
        <Text style={styles.tarea_text}>Empleados</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={empleados}
            onValueChange={(itemValue) => setEmpleado(itemValue)}>
            {empleados.map((empleado, index) => (
              <Picker.Item
                key={index}
                label={empleado.Apellido + ' - ' + empleado.Nombre}
                value={empleado.IdEmpleado}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.tarea_text}>Labores</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={labores}
            onValueChange={(itemValue) => setLabor(itemValue)}>
            {labores.map((labor, index) => (
              <Picker.Item
                key={index}
                label={labor.Nombre}
                value={labor.IdLabor}
              />
            ))}
          </Picker>
        </View>

        {labor && (
          <>
            <Text style={styles.tarea_text}>Actividades</Text>
            <View style={styles.select}>
              <Picker
                selectedValue={actividades}
                onValueChange={(itemValue) => setActividad(itemValue)}>
                {actividades
                  .filter((item) => item.IdLabor === labor)
                  .map((actividad, index) => (
                    <Picker.Item
                      key={index}
                      label={actividad.Nombre}
                      value={actividad.Nombre}
                    />
                  ))}
              </Picker>
            </View>
          </>
        )}

        <Button
          title="Guardar nueva actividad"
          color="#009387"
          onPress={anadirActividad}
        />
      </ModalScreen>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: 15,
  },
  tarea_text: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  select: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cdcdcd',
    marginBottom: 10,
  },
  box_add_actividad: {
    width: 90,
    height: 29,
    textAlign: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#009387',
    color: '#009387',
    fontSize: 12,
    marginTop: 10,
  },
});
