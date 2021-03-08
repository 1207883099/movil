import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Button, Alert} from 'react-native';
import {ModalScreen} from '../modal/modal';
import {Picker} from '@react-native-picker/picker';
import {generarLotes} from '../../hooks/lotes';
/* DB LOCAL */
import {InsertarActividadEmpleado} from '../../db-local/db-actividades-empleado';
import {dbAllEmpleados} from '../../db-local/db-emplados-all';
import {dbMaestra} from '../../db-local/db-maestra';
import {dbTarifas} from '../../db-local/db-tarifas';

export function AddActividad({
  id_parte_diario,
  cuadrilla,
  setReloadEmplAsig,
  idSector,
}) {
  const [isModal, setIsModal] = useState(false);
  const [empleado, setEmpleado] = useState({
    IdEmpleado: '',
    CodigoEmpleado: '',
    Apellidos: '',
  });
  const [actividad, setActividad] = useState();
  ///////////////////
  const [Tarifas, setTarifas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);

      setActividades(dataMaestra[0].Actividades);

      dbAllEmpleados.find({}, async function (err, dataAllEmpleados) {
        err && Alert.alert(err.message);
        setEmpleados(dataAllEmpleados);
      });
    });

    dbTarifas.find({}, async function (err, dataTarifas) {
      err && Alert.alert(err.message);
      setTarifas(dataTarifas);
    });
  }, [cuadrilla]);

  const obtenerTarifa = (IdActividad) => {
    if (Tarifas.length) {
      const Tarifa = Tarifas.find(
        (tarifa) => tarifa.IdActividad === IdActividad,
      );
      return Tarifa;
    }
  };

  const anadirActividad = async () => {
    if (empleado.IdEmpleado && actividad) {
      console.group(empleado, actividad);

      const Tarifa = obtenerTarifa(actividad);
      const lotesGenerados = await generarLotes(dbMaestra, idSector);

      InsertarActividadEmpleado({
        idEmpleado: empleado.IdEmpleado,
        idParteDiario: id_parte_diario,
        CodigoEmpleado: empleado.CodigoEmpleado,
        actividad: actividad,
        isLote: Tarifa.ValidaHectareas,
        lotes: Tarifa.ValidaHectareas ? lotesGenerados : [],
        ValorTarifa: Tarifa.ValorTarifa,
        valorTotal: 0,
        hectaria: 0,
      });

      setIsModal(false);
      setReloadEmplAsig(true);
    } else {
      Alert.alert('Campos vacios, revise y vuelve a intentar');
    }
  };

  return (
    <>
      <Text
        style={[styles.label, styles.box_add_actividad]}
        onPress={() => setIsModal(true)}>
        Agregar empleado
      </Text>

      <ModalScreen isModal={isModal} setIsModal={setIsModal}>
        <Text style={styles.tarea_text}>Empleados</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={empleados}
            onValueChange={(itemValue) => {
              if (itemValue) {
                const findEmpleado = empleados.find(
                  (empleado) => empleado.IdEmpleado === itemValue,
                );
                if (findEmpleado) {
                  setEmpleado({
                    IdEmpleado: findEmpleado.IdEmpleado,
                    CodigoEmpleado: findEmpleado.Codigo,
                    Apellidos: findEmpleado.Apellido,
                  });
                } else {
                  Alert.alert('Ocurrio un error al seleccionar el empleado.');
                }
              }
            }}>
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
        </>

        <Button
          title={`Guardar nueva actividad: ${
            empleado.Apellidos && empleado.Apellidos
          } - ${actividad && actividad}`}
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
    width: 150,
    height: 33,
    textAlign: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'green',
    color: 'green',
    fontSize: 12,
    marginTop: 10,
  },
});
