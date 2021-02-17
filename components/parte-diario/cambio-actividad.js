import React, {useState, useEffect} from 'react';
import {Text, View, Alert, StyleSheet, Button} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {dbMaestra} from '../../db-local/db-maestra';
import {dbTarifas} from '../../db-local/db-tarifas';
import {dbActEmpl} from '../../db-local/db-actividades-empleado';
import {generarLotes} from '../../hooks/lotes';

export function CambioActividad({
  ActivChange,
  setIsModalChangeAct,
  setReloadEmplAsig,
  setIsReload,
  idSector,
}) {
  const [actividad, setActividad] = useState('');
  const [actividades, setActividades] = useState([]);
  const [Tarifas, setTarifas] = useState([]);

  useEffect(() => {
    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);

      setActividades(dataMaestra[0].Actividades);
    });

    dbTarifas.find({}, async function (err, dataTarifas) {
      err && Alert.alert(err.message);
      setTarifas(dataTarifas);
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

  const obtenerTarifa = (IdActividad) => {
    if (Tarifas.length) {
      const Tarifa = Tarifas.find(
        (tarifa) => tarifa.IdActividad === IdActividad,
      );
      return Tarifa;
    }
  };

  const cambioActividad = async () => {
    const Tarifa = obtenerTarifa(actividad);
    const lotesGenerados = await generarLotes(dbMaestra, idSector);

    dbActEmpl.update(
      {_id: ActivChange.idActividadEmple},
      {
        $set: {
          actividad: actividad,
          isLote: Tarifa.ValidaHectareas,
          lotes: Tarifa.ValidaHectareas ? lotesGenerados : [],
          ValorTarifa: Tarifa.ValorTarifa,
        },
      },
    );

    setIsModalChangeAct(false);
    setIsReload(true);
    setReloadEmplAsig(true);
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
                label={
                  actividad.CodigoActividad
                    ? `${actividad.CodigoActividad} - ${actividad.Nombre}`
                    : 'No code' + ' - ' + actividad.Nombre
                }
                value={actividad.IdActividad}
              />
            ))}
        </Picker>
      </View>

      <Button
        title={`Cambiar Actividad: ${actividad}`}
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
