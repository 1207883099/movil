import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, Button, ScrollView, View} from 'react-native';
import {MessageAlert} from '../components/elementos/message';
import {dbMaestra} from '../db-local/db-maestra';
import {dbParteDiario} from '../db-local/db-parte-diario';
import {PaginationParteDiario} from '../components/parte-diario/pagination';
import {InsertarParteDiario} from '../db-local/db-parte-diario';
import {ModalScreen} from '../components/modal/modal';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fecha_actual, getDia, get_Semana_Del_Ano} from '../hooks/fechas';

const ParteDiarioScreen = ({navigation}) => {
  const [isParteDiario, setIsParteDiario] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [isRender, setIsRender] = useState('');
  const [IndexDb, setIndexDb] = useState(0);
  const [thisEmpleado, setThisEmpleado] = useState(0);
  const [next_prev, setNext_Prev] = useState({next: false, prev: false});
  const [MisPartesDiarios, setMisPartesDiarios] = useState({
    _id: '',
    data: [],
  });
  const [Sectores, setSectores] = useState([]);
  const [Labores, setLabores] = useState([]);
  const [Cuadrillas, setCuadrillas] = useState([]);
  const [LaboresAsignado, setLaboresAsignado] = useState([]);
  const [DisponiblesParteDiario, setDisponiblesParteDiario] = useState([]);

  useEffect(() => {
    try {
      const fetchDb = () => {
        dbMaestra.find({}, async function (err, docs) {
          if (err) {
            Alert.alert(err.message);
          }

          if (IndexDb >= 0) {
            setSectores(docs[0].Sectores);
            setCuadrillas(docs[0].My_Cuadrilla);
            setLabores(docs[0].Labores);
          }
        });

        dbParteDiario.find({fecha: fecha_actual()}, async function (err, docs) {
          if (err) {
            Alert.alert(err.message);
          }

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
                DisponiblesParteDiario.length === 0 && disponibles.push(index);

                if (toma_parte_diario) {
                  setIsParteDiario(false);
                  DisponiblesParteDiario.length === 0 && setIndexDb(index);
                  const selectPD =
                    docs[
                      DisponiblesParteDiario.length
                        ? DisponiblesParteDiario[IndexDb]
                        : index
                    ];
                  setMisPartesDiarios({
                    _id: selectPD._id,
                    data: selectPD.Mis_Parte_Diario,
                  });
                }
                toma_parte_diario = false;
              }
            });
            DisponiblesParteDiario.length === 0 &&
              setDisponiblesParteDiario(disponibles);
          }
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
    dbParteDiario.remove({_id}, {multi: true}, function (err, numRemoved) {
      if (err) {
        Alert.alert(err.message);
      }

      Alert.alert(
        `Se elimino el registro con el _id ${_id + ' cantidad:' + numRemoved}.`,
      );
      navigation.navigate('SignInScreen');
    });
  };

  const obtener_labor = (IdLabor) => {
    if (Labores.length > 0) {
      const resul_labor = Labores.find((labor) => labor.IdLabor === IdLabor);
      return resul_labor.Nombre;
    }
  };

  const obtener_empleado = (IdEmpleado) => {
    return Cuadrillas.map((cuadrilla) => {
      const result_empleado = cuadrilla.Empleados.find(
        (empleado) => empleado.IdEmpleado === IdEmpleado,
      );
      if (result_empleado !== undefined) {
        return result_empleado.Nombre + ' - ' + result_empleado.Apellido;
      }
    });
  };

  const obtenerSector = (IdSector) => {
    if (Sectores.length > 0) {
      const Result_Sector = Sectores.find(
        (sector) => sector.IdSector === IdSector,
      );
      return Result_Sector.Nombre + ' - ' + Result_Sector.Nombre_Hacienda;
    }
  };

  const finalizar_plantilla = () => {
    console.log('final');
    const ParteDiario = {
      tipo: MisPartesDiarios.data[0].tipo,
      sector: MisPartesDiarios.data[0].sector,
      labores: LaboresAsignado,
    };

    const Mis_Parte_Diario = [];
    Mis_Parte_Diario.push(ParteDiario);
    InsertarParteDiario([{Mis_Parte_Diario}]);
    setIsReload(true);
  };

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff',
            fontSize: 20,
          }}>
          Parte diario (
          {'dia ' + getDia(new Date()) + ' - semana ' + get_Semana_Del_Ano()})
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
                    <View style={styles.header}>
                      <View style={styles.box}>
                        <Text>
                          <Text style={styles.label}>Sector: </Text>
                          {obtenerSector(parte_diario.sector)}
                        </Text>
                      </View>
                      <View style={styles.box}>
                        <Text>
                          <Text style={styles.label}>Tipo: </Text>
                          {parte_diario.tipo}
                        </Text>
                      </View>
                    </View>

                    {parte_diario.labores[0].labor === 'ninguno' ? (
                      <>
                        <Button
                          color="green"
                          title="Agregar Labores"
                          onPress={() => {
                            setIsModal(true);
                            setIsRender('Agregar-labores');
                          }}
                        />

                        {LaboresAsignado.length > 0 && (
                          <Button
                            title="Finalizar plantilla"
                            onPress={finalizar_plantilla}
                            color="#009387"
                          />
                        )}

                        {LaboresAsignado.map((labores, index) => (
                          <>
                            <Text>{'\n'}</Text>
                            <Text>
                              <Text style={styles.label}>Labor: </Text>
                              {obtener_labor(labores.labor)}
                            </Text>
                            <View style={{padding: 10}} key={index}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                  padding: 10,
                                }}>
                                Empleados Asignados
                              </Text>
                              {labores.Asignado.map((asig, index) => (
                                <Text
                                  style={{
                                    color: '#000',
                                    borderBottom: 2,
                                    borderBottomStyle: 'solid',
                                    borderBottomColor: '#cddcdcd',
                                    borderBottomWidth: 2,
                                  }}
                                  key={index}>
                                  {obtener_empleado(asig.Empleado)}
                                </Text>
                              ))}
                            </View>
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        {parte_diario.labores.map((labores, index) => (
                          <>
                            <Text>
                              <Text style={styles.label}>Labor: </Text>
                              {obtener_labor(labores.labor)}
                            </Text>
                            <View style={{padding: 10}} key={index}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                  padding: 10,
                                }}>
                                Empleados Asignados
                              </Text>
                              {labores.Asignado.map((asig, index) => (
                                <View
                                  style={styles.row_empleado_asig}
                                  key={index}>
                                  <Text>{obtener_empleado(asig.Empleado)}</Text>
                                  <Text
                                    style={styles.btn_actividad}
                                    onPress={() => {
                                      setIsModal(true);
                                      setIsRender('Actividades-asignados');
                                      setThisEmpleado(asig.Empleado);
                                    }}>
                                    <MaterialIcons
                                      name="navigate-next"
                                      color="#009387"
                                      size={20}
                                    />
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </>
                        ))}
                      </>
                    )}
                  </>
                ))}
              </>
            )}

            <View
              style={{
                borderBottom: 2,
                borderBottomColor: '#cdcdcd',
                borderBottomWidth: 2,
                padding: 10,
              }}
            />
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
          disabled={LaboresAsignado.length > 0}
          onPress={() => {
            setIsModal(true);
            setIsRender('Create-plantilla');
          }}
        />
      </View>

      <ModalScreen
        isModal={isModal}
        setIsModal={setIsModal}
        setIsReload={setIsReload}
        render={isRender}
        setLaboresAsignado={setLaboresAsignado}
        LaboresAsignado={LaboresAsignado}
        thisEmpleado={thisEmpleado}
        navigation={navigation}
      />
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
    paddingVertical: 30,
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  btn_create_plantilla: {
    padding: 10,
    position: 'absolute',
    width: '100%',
    bottom: 0,
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
});
