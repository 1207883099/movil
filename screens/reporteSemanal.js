import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {MessageAlert} from '../components/elementos/message';
import {LoaderSpinner} from '../components/loader/spiner-loader';
/* DB LOCAL */
import {dbConfiguracion} from '../db-local/db-configuracion';
import {dbParteDiario} from '../db-local/db-parte-diario';
import {dbActEmpl} from '../db-local/db-actividades-empleado';
import {dbMaestra} from '../db-local/db-maestra';

const ReporteSemanal = () => {
  const [loading, setLoading] = useState(false);
  const [periodo, setPeriodo] = useState({
    Nombre: undefined,
    _id: undefined,
    section: undefined,
  });
  const [fiscal, setFiscal] = useState({
    valuie: undefined,
    Nombre: undefined,
  });
  const [reportes, setReportes] = useState([]);
  const [Empleados, setEmpleados] = useState([]);
  const [Actividades, setActividades] = useState([]);

  useEffect(() => {
    setLoading(true);

    dbConfiguracion.find({}, async function (err, dataConfig) {
      err && Alert.alert(err.message);

      const thisPeriodo = dataConfig.find((item) => item.section === 'Periodo');
      setPeriodo(thisPeriodo);
      setFiscal(dataConfig.find((item) => item.section === 'Fiscal'));

      const dias = [
        'Lunes',
        'Martes',
        'Miercoles',
        'Jueves',
        'Viernes',
        'Sabado',
        'Domingo',
      ];

      dbParteDiario.find(
        {$not: {cuadrilla: 'undefined'}, semana: thisPeriodo.Nombre},
        function (err, dataPD) {
          err && Alert.alert(err.message);
          const report_foy_day = [];
          dataPD.length === 0 && setLoading(false);

          for (let j = 0; j < dias.length; j++) {
            const filterDay = dataPD.filter((item) => item.dia === dias[j]);

            for (let i = 0; i < filterDay.length; i++) {
              dbActEmpl.find(
                {idParteDiario: filterDay[i]._id},
                function (err, dataActiEmpl) {
                  err && Alert.alert(err.message);
                  const data_for_day = [];

                  for (let k = 0; k < dataActiEmpl.length; k++) {
                    let item = dataActiEmpl[k];
                    data_for_day.push({
                      actividad: item.actividad,
                      idEmpleado: item.idEmpleado,
                      hectaria: item.hectaria,
                    });
                  }

                  report_foy_day.push({
                    dia: dias[j],
                    iteracion: filterDay[i].iteracion,
                    data: data_for_day,
                  });

                  setTimeout(() => {
                    setReportes(report_foy_day);
                    setLoading(false);
                  }, 2000);
                },
              );
            }
          }
        },
      );
    });
  }, []);

  useEffect(() => {
    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);
      setActividades(dataMaestra[0].Actividades);

      let EmpleadosAll = [];
      for (let i = 0; i < dataMaestra[0].My_Cuadrilla.length; i++) {
        EmpleadosAll = EmpleadosAll.concat(
          dataMaestra[0].My_Cuadrilla[i].Empleados,
        );
      }

      setEmpleados(EmpleadosAll);
    });
  }, []);

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
        return 'Cargando...';
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titePD}>
        Reporte de:
        {' Semana ' + periodo.Nombre + ' del ' + fiscal.Nombre}
      </Text>

      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          {reportes.map((reporte) => (
            <>
              <View key={reporte.dia}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  {reporte.dia} - {reporte.iteracion}
                </Text>
              </View>

              {reporte.data
                .sort((a, b) => a.actividad > b.actividad)
                .map((value) => (
                  <View key={value.idEmpleado}>
                    <Text style={{color: '#000', padding: 7}}>
                      {obtener_empleado(value.idEmpleado)}{' '}
                      <Text style={{color: '#b08b05'}}>
                        /{obtenerActividad(value.actividad)}{' '}
                      </Text>{' '}
                      <Text style={{color: 'blue'}}>/ {value.hectaria} </Text>
                    </Text>
                  </View>
                ))}
            </>
          ))}

          {loading && <LoaderSpinner />}

          {reportes.length === 0 && !loading && (
            <MessageAlert
              background="#cce5ff"
              content="Por el momento no existe ningun registro del parte diario semanal."
            />
          )}
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default ReporteSemanal;

const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: '#009387',
  },
  footer: {
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 70,
  },
  titePD: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 20,
  },
});
