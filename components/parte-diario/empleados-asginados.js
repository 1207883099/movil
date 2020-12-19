import React, {useEffect, useState, memo} from 'react';
import {Text, View, Alert, StyleSheet, Button} from 'react-native';
import {dbCargos} from '../../db-local/db-cargos';
import {InsertarCuadrillaPD} from '../../db-local/db-cuadrilla-parte-diario';
import {
  InsertarActividadEmpleado,
  dbActEmpl,
} from '../../db-local/db-actividades-empleado';
import {dbParteDiario} from '../../db-local/db-parte-diario';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function EmpleadosAsignados({
  Empleados,
  actions,
  id_parte_diario,
  cuadrilla,
  setIsReload,
  setIsModal,
  setIsRender,
}) {
  const [Cargos, setCargos] = useState([]);
  const [ActivEmple, setActivEmple] = useState([]);

  useEffect(() => {
    dbCargos.find({}, async function (err, docs) {
      err && Alert.alert(err.message);
      setCargos(docs);
    });

    dbActEmpl.find({idParteDiario: id_parte_diario}, async function (
      err,
      docs,
    ) {
      err && Alert.alert(err.message);
      setActivEmple(docs);
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

      <Text style={[styles.label, styles.box_actividad]}>Actividades</Text>
      <View style={{padding: 10}} key={0}>
        <Text style={{textAlign: 'center', fontWeight: 'bold', padding: 10}}>
          Empleados Asignados
        </Text>
        {ActivEmple.length === 0
          ? Empleados.map((obrero, index) => (
              <View style={styles.row_empleado_asig} key={index}>
                <Text>
                  {
                    <>
                      <Text style={styles.label_actividad}>
                        {obtenerCargo(obrero.Cargo)} &nbsp; - &nbsp;
                      </Text>
                      <Text style={{fontSize: 12}}>{obrero.Apellido}</Text>
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
                      <Text style={styles.label_actividad}>
                        {activEmple.actividad}
                        &nbsp; / &nbsp;
                      </Text>
                      <Text style={{fontSize: 12}}>
                        {obtener_empleado(activEmple.idEmpleado)}
                      </Text>
                    </>
                  }
                </Text>
                {actions && (
                  <Text
                    style={styles.btn_actividad}
                    onPress={() => {
                      setIsModal(true);
                      setIsRender('Actions-actividad-empleado');
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
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: 15,
  },
  btn_actividad: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#009387',
    padding: 5,
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
    width: 90,
    height: 29,
    textAlign: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#b08b05',
    color: '#b08b05',
    fontSize: 12,
    marginTop: 10,
  },
  label_actividad: {
    color: '#b08b05',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default memo(EmpleadosAsignados);
