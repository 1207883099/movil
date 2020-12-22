import React, {useEffect, useState, memo} from 'react';
import {Text, View, Alert, StyleSheet, Button} from 'react-native';
/* DB LOCAL */
import {dbCargos} from '../../db-local/db-cargos';
import {
  InsertarActividadEmpleado,
  dbActEmpl,
} from '../../db-local/db-actividades-empleado';
import {dbParteDiario} from '../../db-local/db-parte-diario';
import {InsertarCuadrillaPD} from '../../db-local/db-cuadrilla-parte-diario';
/* COMPONENTS */
import {ModalScreen} from '../modal/modal';
import {CalificarActividad} from './calificar-actividad';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AddActividad} from './add-actividad';

function EmpleadosAsignados({
  Empleados,
  actions,
  id_parte_diario,
  cuadrilla,
  setIsReload,
  idSector,
}) {
  const [Cargos, setCargos] = useState([]);
  const [ActivEmple, setActivEmple] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [selectIdActiEmple, SetselectActiEmple] = useState('');

  useEffect(() => {
    dbCargos.find({}, async function (err, dataCargos) {
      err && Alert.alert(err.message);
      setCargos(dataCargos);
    });

    dbActEmpl.find({idParteDiario: id_parte_diario}, async function (
      err,
      dataActEmpl,
    ) {
      err && Alert.alert(err.message);
      setActivEmple(dataActEmpl);
    });
  }, [id_parte_diario]);

  const obtenerCargo = (codigoCargo) => {
    if (Cargos.length) {
      const NameCargo = Cargos.find((cargo) => cargo.Codigo === codigoCargo);
      return NameCargo.Nombre;
    }
  };

  const obtener_empleado = (IdEmpleado) => {
    if (Empleados.length) {
      const result = Empleados.find(
        (empleado) => empleado.IdEmpleado === IdEmpleado,
      );
      if (result === undefined) {
        return 'llamismo';
      } else {
        return result.Apellido;
      }
    }
  };

  const finish_template = () => {
    InsertarCuadrillaPD({
      idParteDiario: id_parte_diario,
      cuadrilla,
    });

    dbParteDiario.update(
      {_id: id_parte_diario, cuadrilla: 'undefined'},
      {$set: {cuadrilla: cuadrilla}},
    );

    Empleados.map((empleado) =>
      InsertarActividadEmpleado({
        idEmpleado: empleado.IdEmpleado,
        idParteDiario: id_parte_diario,
        actividad: obtenerCargo(empleado.Cargo),
      }),
    );
    setIsReload(true);
  };

  return (
    <>
      {!actions && (
        <Button
          title="Finalizar plantilla"
          onPress={finish_template}
          color="#009387"
        />
      )}

      <View style={styles.header}>
        <Text
          style={[
            styles.label,
            styles.box_actividad,
            {borderColor: '#b08b05', color: '#b08b05'},
          ]}>
          Actividades
        </Text>
        <Text
          style={[
            styles.label,
            styles.box_actividad,
            {borderColor: 'royalblue', color: 'royalblue'},
          ]}>
          Hectareas
        </Text>
        <Text
          style={[
            styles.label,
            styles.box_actividad,
            {borderColor: '#009387', color: '#009387'},
          ]}>
          Calificar
        </Text>
        {ActivEmple.length !== 0 && (
          <View>
            <AddActividad
              id_parte_diario={id_parte_diario}
              cuadrilla={cuadrilla}
              setIsReload={setIsReload}
            />
          </View>
        )}
      </View>
      <View style={{padding: 10}} key={0}>
        <Text style={{textAlign: 'center', fontWeight: 'bold', padding: 10}}>
          Empleados Asignados {cuadrilla && ': ' + cuadrilla}
        </Text>
        {ActivEmple.length === 0
          ? Empleados.map((obrero, index) => (
              <View style={styles.row_empleado_asig} key={index}>
                <Text>
                  {
                    <>
                      <Text style={{fontSize: 12}}>{obrero.Apellido}</Text>
                      <Text
                        style={[styles.label_actividad, {color: '#b08b05'}]}>
                        &nbsp; - &nbsp; {obtenerCargo(obrero.Cargo)}
                      </Text>
                    </>
                  }
                </Text>
              </View>
            ))
          : ActivEmple.map((activEmple, index) => (
              <View style={styles.row_empleado_asig} key={index}>
                <Text>
                  {
                    <>
                      <Text style={{fontSize: 12}}>
                        {obtener_empleado(activEmple.idEmpleado)}
                      </Text>
                      <Text
                        style={[styles.label_actividad, {color: '#b08b05'}]}>
                        &nbsp; / &nbsp; {activEmple.actividad}
                      </Text>
                      <Text
                        style={[styles.label_actividad, {color: 'royalblue'}]}>
                        &nbsp; / &nbsp; 10
                      </Text>
                    </>
                  }
                </Text>
                {actions && (
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
            ))}
      </View>

      <ModalScreen isModal={isModal} setIsModal={setIsModal}>
        <CalificarActividad
          selectIdActiEmple={selectIdActiEmple}
          setIsModal={setIsModal}
          setIsReload={setIsReload}
          idSector={idSector}
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
