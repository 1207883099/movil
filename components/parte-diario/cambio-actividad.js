import React, {useState, useEffect} from 'react';
import {Text, View, Alert, StyleSheet, Button} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {dbMaestra} from '../../db-local/db-maestra';
import {dbActEmpl} from '../../db-local/db-actividades-empleado';

export function CambioActividad({
  ActivChange,
  setIsModalChangeAct,
  setIsReload,
}) {
  const [actividad, setActividad] = useState();
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);

      setActividades(dataMaestra[0].Actividades);
    });
  }, []);

  const obtenerActividad = (idActividad) => {
    if (actividades.length) {
      const Actividad = actividades.find(
        (activi) => activi.IdActividad === idActividad,
      );
      return Actividad ? Actividad.Nombre : 'Cargando...';
    }
  };

  const cambioActividad = () => {
    dbActEmpl.update(
      {_id: ActivChange.idActividadEmple},
      {$set: {actividad: actividad}},
    );

    setIsModalChangeAct(false);
    setIsReload(true);
  };

  return (
    <>
      <Text>
        Actividad Actual:{' '}
        <Text style={{color: '#b08b05'}}>
          {' '}
          {obtenerActividad(ActivChange.actividad)}
        </Text>
      </Text>
      <Text style={styles.tarea_text}>Actividades</Text>
      <View style={styles.select}>
        <Picker
          selectedValue={actividades}
          onValueChange={(itemValue) => itemValue && setActividad(itemValue)}>
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

      <Button
        title="Cambiar Actividad"
        color="#009387"
        onPress={cambioActividad}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tarea_text: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    marginTop: 15,
  },
  select: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cdcdcd',
    marginBottom: 10,
  },
});
