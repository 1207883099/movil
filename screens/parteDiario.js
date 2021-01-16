/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';
import {Alert, StyleSheet, Text, Button, ScrollView, View} from 'react-native';
/* DB LOCAL */
import {dbMaestra} from '../db-local/db-maestra';
import {InsertarParteDiario, dbParteDiario} from '../db-local/db-parte-diario';
import {dbActEmpl} from '../db-local/db-actividades-empleado';
import {dbCuadrillaPD} from '../db-local/db-cuadrilla-parte-diario';
import {dbConfiguracion} from '../db-local/db-configuracion';
/* COMPONENTS */
import {MessageAlert} from '../components/elementos/message';
import EmpleadosAsignados from '../components/parte-diario/empleados-asginados';
import {PaginationParteDiario} from '../components/parte-diario/pagination';
import {GenerarTareaEmpleado} from '../components/parte-diario/generar-tarea-empleado';
import * as Animatable from 'react-native-animatable';
import {FechaContext} from '../components/context/fecha';
/* HOOKS */
import {getDia} from '../hooks/fechas';

const ParteDiarioScreen = ({navigation}) => {
  const {fechaCtx} = useContext(FechaContext);
  const [isParteDiario, setIsParteDiario] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [IndexDb, setIndexDb] = useState(0);
  const [next_prev, setNext_Prev] = useState({next: false, prev: false});
  const [MisPartesDiarios, setMisPartesDiarios] = useState({
    _id: '',
    data: [],
    cuadrilla: undefined,
  });
  const [sector, setSector] = useState({
    IdSector: undefined,
    Nombre: undefined,
  });
  const [periodo, setPeriodo] = useState({
    Nombre: undefined,
    _id: undefined,
    section: undefined,
  });
  const [fiscal, setFiscal] = useState({
    valuie: undefined,
    Nombre: undefined,
  });
  const [Cuadrillas, setCuadrillas] = useState([]);
  const [DisponiblesParteDiario, setDisponiblesParteDiario] = useState([]);
  const [CPD, setCPD] = useState({
    _id: '',
    cuadrilla: '',
    idParteDiario: '',
  });

  useEffect(() => {
    try {
      const fetchDb = () => {
        dbMaestra.find({}, async function (err, dataMaestra) {
          err && Alert.alert(err.message);

          if (IndexDb >= 0) {
            setCuadrillas(dataMaestra[0].My_Cuadrilla);
          }
        });

        dbConfiguracion.find({}, async function (err, dataConfig) {
          err && Alert.alert(err.message);
          const thisPeriodo = dataConfig.find(
            (item) => item.section === 'Periodo',
          );
          setFiscal(dataConfig.find((item) => item.section === 'Fiscal'));
          setSector(dataConfig.find((item) => item.section === 'Sector'));
          setPeriodo(thisPeriodo);

          dbParteDiario.find(
            {fecha: fechaCtx, semana: thisPeriodo.Nombre},
            async function (err, docs) {
              err && Alert.alert(err.message);

              if (IndexDb >= 0) {
                let disponibles = [];
                let toma_parte_diario = true;
                docs.map((database, index) => {
                  if (
                    docs[
                      DisponiblesParteDiario.length
                        ? DisponiblesParteDiario[IndexDb]
                        : index
                    ].Mis_Parte_Diario
                  ) {
                    DisponiblesParteDiario.length === 0 &&
                      disponibles.push(index);

                    if (toma_parte_diario) {
                      setIsParteDiario(false);

                      // DisponiblesParteDiario.length === 0 && setIndexDb(index);

                      const selectPD =
                        docs[
                          DisponiblesParteDiario.length
                            ? DisponiblesParteDiario[IndexDb]
                            : index
                        ];

                      setMisPartesDiarios({
                        _id: selectPD._id,
                        data: selectPD.Mis_Parte_Diario,
                        cuadrilla: selectPD.cuadrilla,
                      });

                      dbCuadrillaPD.findOne(
                        {
                          idParteDiario: selectPD._id,
                          cuadrilla: selectPD.cuadrilla,
                        },
                        async function (err, CPD) {
                          err && Alert.alert(err.message);

                          if (CPD) {
                            setCPD({
                              _id: CPD._id,
                              cuadrilla: CPD.cuadrilla,
                              idParteDiario: CPD.idParteDiario,
                            });
                          } else {
                            setCPD({
                              _id: undefined,
                              cuadrilla: undefined,
                              idParteDiario: undefined,
                            });
                          }
                        },
                      );
                    }
                    toma_parte_diario = false;
                  }
                });
                DisponiblesParteDiario.length === 0 &&
                  setDisponiblesParteDiario(disponibles);
              }
            },
          );
        });
      };

      if (isReload) {
        setIsReload(false);
      }

      fetchDb();
    } catch (error) {
      Alert.alert(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReload, IndexDb, dbMaestra]);

  const delete_parte_diario = (_id) => {
    Alert.alert(
      'Eliminar parte diario',
      `Esta seguro en eliminar parte diario: ${getDia(
        new Date(fechaCtx),
      )} de semana ${periodo.Nombre} del ${fiscal.Nombre}`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel delete parte diario'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dbParteDiario.remove({_id}, {multi: true}, function (err) {
              err && Alert.alert(err.message);

              Alert.alert(
                `Se elimino parte diario: ${getDia(
                  new Date(fechaCtx),
                )} de semana ${periodo.Nombre} del ${fiscal.Nombre}`,
              );

              dbActEmpl.remove({idParteDiario: _id}, {multi: true}, function (
                err,
              ) {
                err && Alert.alert(err.message);
                navigation.navigate('SignInScreen');
              });
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const create_templeate = () => {
    const ParteDiario = {
      sector: sector.IdSector,
      Nombre: sector.Nombre,
    };

    const Mis_Parte_Diario = [];
    Mis_Parte_Diario.push(ParteDiario);

    InsertarParteDiario({
      Mis_Parte_Diario,
      fecha: fechaCtx,
      semana: periodo.Nombre,
      cuadrilla: 'undefined',
    });

    setIsReload(true);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titePD}>
          Parte diario:
          {' ' +
            getDia(new Date(fechaCtx)) +
            ', Sem ' +
            periodo.Nombre +
            ' del ' +
            fiscal.Nombre}
        </Text>

        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <ScrollView>
            {isParteDiario ? (
              <MessageAlert
                background="#cce5ff"
                content="Por el momento no existe ningun parte diario."
              />
            ) : (
              <>
                {MisPartesDiarios.data.map((parte_diario) => (
                  <>
                    <Text
                      style={styles.eliminar_parte_diario}
                      onPress={() => delete_parte_diario(MisPartesDiarios._id)}>
                      Eliminar parte diario
                    </Text>

                    <Text>
                      <Text style={styles.label}>Sector: </Text>
                      {parte_diario.Nombre}
                    </Text>

                    {CPD.cuadrilla ? (
                      <EmpleadosAsignados
                        Empleados={
                          Cuadrillas.find(
                            (cuadrilla) => cuadrilla.Nombre === CPD.cuadrilla,
                          ).Empleados
                        }
                        cuadrilla={CPD.cuadrilla}
                        id_parte_diario={MisPartesDiarios._id}
                        actions={true}
                        idSector={parte_diario.sector}
                        setIsReload={setIsReload}
                      />
                    ) : (
                      CPD.cuadrilla === undefined && (
                        <GenerarTareaEmpleado
                          Cuadrillas={Cuadrillas}
                          id_parte_diario={MisPartesDiarios._id}
                          setIsReload={setIsReload}
                        />
                      )
                    )}
                  </>
                ))}
              </>
            )}
          </ScrollView>
        </Animatable.View>
      </View>

      <View style={styles.btn_create_plantilla}>
        <PaginationParteDiario
          next_prev={next_prev}
          DisponiblesParteDiario={DisponiblesParteDiario}
          IndexDb={IndexDb}
          setIndexDb={setIndexDb}
          setIsReload={setIsReload}
        />
        <Button
          title="Crear Plantilla"
          disabled={false}
          onPress={create_templeate}
        />
      </View>
    </>
  );
};

export default ParteDiarioScreen;

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
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 160,
    height: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btn_create_plantilla: {
    bottom: 0,
    padding: 10,
    width: '100%',
    position: 'absolute',
    backgroundColor: '#fff',
  },
  eliminar_parte_diario: {
    textAlign: 'center',
    color: 'red',
    padding: 5,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'red',
    marginBottom: 10,
  },
  titePD: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 20,
  },
});
