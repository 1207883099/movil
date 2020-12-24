import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Button, Alert} from 'react-native';
import {ModalScreen} from '../modal/modal';
import {Picker} from '@react-native-picker/picker';
/* DB LOCAL */
import {InsertarActividadEmpleado} from '../../db-local/db-actividades-empleado';
import {dbMaestra} from '../../db-local/db-maestra';

export function AddActividad({id_parte_diario, cuadrilla, navigation}) {
  const [isModal, setIsModal] = useState(false);
  const [empleado, setEmpleado] = useState();
  const [actividad, setActividad] = useState();
  ///////////////////
  const [empleados, setEmpleados] = useState([]);
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);

      setActividades(dataMaestra[0].Actividades);
      setEmpleados(
        dataMaestra[0].My_Cuadrilla.find((item) => item.Nombre === cuadrilla)
          .Empleados,
      );
    });
  }, [cuadrilla]);

  const anadirActividad = () => {
    if (empleado && actividad) {
      console.group(empleado, actividad);
      InsertarActividadEmpleado({
        idEmpleado: empleado,
        idParteDiario: id_parte_diario,
        actividad: actividad,
      });
      navigation.navigate('SignInScreen');
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
            onValueChange={(itemValue) => itemValue && setEmpleado(itemValue)}>
            <Picker.Item label="** SELECCIONA **" value={''} />
            {empleados
              .sort((a, b) => a.Apellido > b.Apellido)
              .map((empleado, index) => (
                <Picker.Item
                  key={index}
                  label={empleado.Apellido + ' - ' + empleado.Nombre}
                  value={empleado.IdEmpleado}
                />
              ))}
          </Picker>
        </View>

        <>
          <Text style={styles.tarea_text}>Actividades</Text>
          <View style={styles.select}>
            <Picker
              selectedValue={actividades}
              onValueChange={(itemValue) =>
                itemValue && setActividad(itemValue)
              }>
              <Picker.Item label="** SELECCIONA **" value={''} />
              {actividades
                .sort((a, b) => a.Nombre > b.Nombre)
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
    borderColor: 'green',
    color: 'green',
    fontSize: 12,
    marginTop: 10,
  },
});
