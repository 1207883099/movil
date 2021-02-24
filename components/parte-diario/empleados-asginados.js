/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, memo} from 'react';
import {Text, View, Alert, StyleSheet, Button} from 'react-native';
/* DB LOCAL */
import {dbCargos} from '../../db-local/db-cargos';
import {
  InsertarActividadEmpleado,
  dbActEmpl,
} from '../../db-local/db-actividades-empleado';
import {dbMe} from '../../db-local/db-me';
import {dbTarifas} from '../../db-local/db-tarifas';
import {dbMaestra} from '../../db-local/db-maestra';
import {dbParteDiario} from '../../db-local/db-parte-diario';
import {InsertarCuadrillaPD} from '../../db-local/db-cuadrilla-parte-diario';
/* COMPONENTS */
import {ModalScreen} from '../modal/modal';
import {CalificarActividad} from './calificar-actividad';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AddActividad} from './add-actividad';
import {CambioActividad} from './cambio-actividad';
import {generarLotes} from '../../hooks/lotes';

function EmpleadosAsignados({
  Empleados,
  secuencia,
  actions,
  id_parte_diario,
  cuadrilla,
  setIsReload,
  idSector,
}) {
  const [Cargos, setCargos] = useState([]);
  const [Tarifas, setTarifas] = useState([]);
  const [Actividades, setActividades] = useState([]);
  const [ReloadActEmpl, setReloadActEmpl] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [ActivEmple, setActivEmple] = useState([]);
  const [ActivChange, setActivChange] = useState({
    actividad: undefined,
    idActividadEmple: undefined,
  });
  const [me, setMe] = useState({
    Nombre: undefined,
    Apellido: undefined,
  });
  const [isModalChangeAct, setIsModalChangeAct] = useState(false);
  const [ReloadEmplAsig, setReloadEmplAsig] = useState(false);
  const [selectIdActiEmple, SetselectActiEmple] = useState('');

  useEffect(() => {
    dbCargos.find({}, async function (err, dataCargos) {
      err && Alert.alert(err.message);
      setCargos(dataCargos);
    });

    getActividadEmpleado();

    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);
      setActividades(dataMaestra[0].Actividades);
    });

    dbMe.findOne({section: 'me'}, async function (err, dataMe) {
      err && Alert.alert(err.message);
      setMe(dataMe.MyData);
    });

    dbTarifas.find({}, async function (err, dataTarifas) {
      err && Alert.alert(err.message);
      setTarifas(dataTarifas);
    });

    if (ReloadEmplAsig) {
      setReloadEmplAsig(false);
    }
  }, [id_parte_diario, ReloadEmplAsig]);

  useEffect(() => {
    if (ReloadActEmpl) {
      getActividadEmpleado();
      setReloadActEmpl(false);
    }
  }, [ReloadActEmpl]);

  const obtenerCargo = (codigoCargo, propiedad) => {
    if (Cargos.length) {
      const Cargo = Cargos.find((cargo) => cargo.Codigo === codigoCargo);
      if (Cargo) {
        return obtenerActividad(Cargo.ActividadId, propiedad);
      } else {
        return 'Cargando...';
      }
    }
  };

  const getActividadEmpleado = () => {
    dbActEmpl.find(
      {idParteDiario: id_parte_diario},
      async function (err, dataActEmpl) {
        err && Alert.alert(err.message);
        setActivEmple(dataActEmpl);
      },
    );
  };

  const obtenerActividad = (idActividad, propiedad) => {
    if (Actividades.length) {
      const Actividad = Actividades.find(
        (activi) => activi.IdActividad === idActividad,
      );
      if (Actividad) {
        return propiedad === 'ActividadId'
          ? Actividad.IdActividad
          : Actividad.Nombre;
      } else {
        return '( Sin Cargo )';
      }
    }
  };

  const obtenerTarifa = (IdActividad) => {
    if (Tarifas.length) {
      const Tarifa = Tarifas.find(
        (tarifa) => tarifa.IdActividad === IdActividad,
      );
      if (Tarifa === undefined) {
        return 'Cargando...';
      } else {
        return Tarifa;
      }
    }
  };

  const obtener_empleado = (IdEmpleado) => {
    if (Empleados.length) {
      const result = Empleados.find(
        (empleado) => empleado.IdEmpleado === IdEmpleado,
      );
      if (result === undefined) {
        return 'Cargando...';
      } else {
        return result.Apellido;
      }
    }
  };

  const finish_template = async () => {
    InsertarCuadrillaPD({
      idParteDiario: id_parte_diario,
      cuadrilla,
    });

    dbParteDiario.update(
      {_id: id_parte_diario, cuadrilla: 'undefined'},
      {$set: {cuadrilla: cuadrilla, iteracion: secuencia}},
    );

    const lotesGenerados = await generarLotes(dbMaestra, idSector);

    Empleados.map(async (empleado) => {
      const ActividadId = obtenerCargo(empleado.Cargo, 'ActividadId');
      const Tarifa = obtenerTarifa(ActividadId);

      InsertarActividadEmpleado({
        idEmpleado: empleado.IdEmpleado,
        CodigoEmpleado: empleado.Codigo,
        idParteDiario: id_parte_diario,
        actividad: ActividadId,
        isLote: Tarifa.ValidaHectareas,
        lotes: Tarifa.ValidaHectareas ? lotesGenerados : [],
        ValorTarifa: Tarifa.ValorTarifa,
        valorTotal: 0,
        hectaria: 0,
      });
    });

    setIsReload(true);
  };

  const deleteEmpleado = (idEmpleado) => {
    Alert.alert(
      obtener_empleado(idEmpleado),
      '¿Seguro que deseas eliminar este registro?',
      [
        {
          text: 'No',
          onPress: () => console.log('no'),
          style: 'cancel',
        },
        {
          text: 'Si',
          onPress: () => {
            dbActEmpl.remove(
              {idEmpleado, idParteDiario: id_parte_diario},
              function (err) {
                err && Alert.alert(err.message);
              },
            );
            setReloadActEmpl(true);
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <>
      <Text style={{marginTop: 1}}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Jefe:</Text>
        {me.Nombre && me.Nombre + ' ' + me.Apellido}
      </Text>

      <Text style={{marginTop: 1}}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Cuadrilla:</Text>{' '}
        {cuadrilla && cuadrilla}
      </Text>

      {!actions && (
        <Button
          title="Finalizar plantilla"
          onPress={finish_template}
          color="#009387"
        />
      )}

      {ActivEmple.length !== 0 && (
        <AddActividad
          id_parte_diario={id_parte_diario}
          cuadrilla={cuadrilla}
          setReloadEmplAsig={setReloadEmplAsig}
          idSector={idSector}
        />
      )}
      <View>
        {ActivEmple.length === 0
          ? Empleados.map((obrero, index) => (
              <View style={styles.row_empleado_asig} key={index}>
                <Text>
                  {
                    <>
                      <Text style={{fontSize: 12}}>{obrero.Apellido}</Text>
                      <Text
                        style={[styles.label_actividad, {color: '#b08b05'}]}>
                        &nbsp; - &nbsp; {obtenerCargo(obrero.Cargo, 'Nombre')}
                      </Text>
                    </>
                  }
                </Text>
              </View>
            ))
          : ActivEmple.sort((a, b) => a.actividad > b.actividad).map(
              (activEmple, index) => (
                <View style={styles.row_empleado_asig} key={index}>
                  <Text>
                    {
                      <>
                        <Text
                          style={{fontSize: 12}}
                          onPress={() => deleteEmpleado(activEmple.idEmpleado)}>
                          {obtener_empleado(activEmple.idEmpleado)}
                        </Text>
                        <Text
                          style={[styles.label_actividad, {color: '#b08b05'}]}>
                          &nbsp; / &nbsp;{' '}
                          <Text
                            onPress={() => {
                              if (activEmple.hectaria === 0) {
                                setActivChange({
                                  actividad: activEmple.actividad,
                                  idActividadEmple: activEmple._id,
                                });
                                setIsModalChangeAct(true);
                              } else {
                                Alert.alert(
                                  'Asegurese de cambiar la actividad antes de calificarlo.',
                                );
                              }
                            }}>
                            {obtenerActividad(activEmple.actividad, 'Nombre')}
                          </Text>
                        </Text>
                        <Text
                          style={[
                            styles.label_actividad,
                            {color: 'royalblue'},
                          ]}>
                          &nbsp; /{' '}
                          {activEmple.hectaria ? activEmple.hectaria : 0}
                        </Text>
                      </>
                    }
                  </Text>
                  {actions &&
                    obtenerActividad(activEmple.actividad, 'Nombre') !==
                      '( Sin Cargo )' && (
                      <Text
                        style={styles.btn_actividad}
                        onPress={() => {
                          setIsModal(true);
                          SetselectActiEmple(activEmple._id);
                        }}>
                        <MaterialIcons
                          name="navigate-next"
                          color="#009387"
                          size={20}
                        />
                      </Text>
                    )}
                </View>
              ),
            )}
      </View>

      <ModalScreen isModal={isModal} setIsModal={setIsModal}>
        <CalificarActividad
          selectIdActiEmple={selectIdActiEmple}
          setIsModal={setIsModal}
          setReloadEmplAsig={setReloadEmplAsig}
          setIsReload={setIsReload}
          idSector={idSector}
        />
      </ModalScreen>

      <ModalScreen isModal={isModalChangeAct} setIsModal={setIsModalChangeAct}>
        <CambioActividad
          ActivChange={ActivChange}
          setIsModalChangeAct={setIsModalChangeAct}
          setReloadEmplAsig={setReloadEmplAsig}
          idSector={idSector}
          setIsReload={setIsReload}
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
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn_actividad: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#009387',
    padding: 4,
  },
  row_empleado_asig: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#000',
    padding: 5,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#cdcdcd',
    marginBottom: 10,
  },
  box_actividad: {
    width: 80,
    height: 29,
    textAlign: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 12,
    marginTop: 10,
  },
  label_actividad: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default memo(EmpleadosAsignados);
