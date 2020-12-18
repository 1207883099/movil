import React, {useEffect, useState} from 'react';
import {Text, View, Alert, StyleSheet, Button} from 'react-native';
import {dbCargos} from '../../db-local/db-cargos';
import {InsertarCuadrillaPD} from '../../db-local/db-cuadrilla-parte-diario';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export function EmpleadosAsignados({
  Empleados,
  actions,
  id_parte_diario,
  cuadrilla,
  setIsReload,
}) {
  const [Cargos, setCargos] = useState([]);

  useEffect(() => {
    dbCargos.find({}, async function (err, docs) {
      err && Alert.alert(err.message);
      setCargos(docs);
    });
  }, []);

  const obtenerCargo = (codigoCargo) => {
    if (Cargos.length) {
      const NameCargo = Cargos.find((cargo) => cargo.Codigo === codigoCargo);
      return NameCargo.Nombre;
    }
  };

  const finish_template = () => {
    InsertarCuadrillaPD({idParteDiario: id_parte_diario, cuadrilla});
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
        {Empleados.map((obrero, index) => (
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
            {actions && (
              <Text
                style={styles.btn_actividad}
                onPress={() => {
                  /* setIsModal(true);
                        setIsRender('Actividades-asignados');
                        setThisEmpleado(asig.Empleado); */
                  console.log('califica');
                }}>
                <MaterialIcons name="navigate-next" color="#009387" size={20} />
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
