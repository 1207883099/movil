import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, Button, ScrollView, View} from 'react-native';
import {MessageAlert} from '../components/pequenos/message';
import {db, insertar} from '../db-local/config-db-local';
import {ModalScreen} from '../components/modal/modal';
import * as Animatable from 'react-native-animatable';

const ParteDiarioScreen = ({navigation}) => {
  const [isParteDiario, setIsParteDiario] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [isRender, setIsRender] = useState('');
  const [IndexDb, setIndexDb] = useState(1);
  const [next_prev, setNext_Prev] = useState({next: true, prev: true});
  const [MisPartesDiarios, setMisPartesDiarios] = useState([]);
  const [Sectores, setSectores] = useState([]);
  const [Labores, setLabores] = useState([]);
  const [Cuadrillas, setCuadrillas] = useState([]);
  const [LaboresAsignado, setLaboresAsignado] = useState([]);

  useEffect(() => {
    try {
      const fetchDb = () => {
        db.find({}, async function (err, docs) {
          if (err) {
            Alert.alert(err.message);
          }

          console.log(docs[0]);

          if (IndexDb > 0) {
            if (docs[IndexDb]) {
              setIsParteDiario(false);
              setMisPartesDiarios(docs[IndexDb].Mis_Parte_Diario);
              setSectores(docs[0].Sectores);
              setCuadrillas(docs[0].My_Cuadrilla);
              setLabores(docs[0].Labores);

              if (IndexDb === 1) {
                setNext_Prev({next: true, prev: true});
              } else {
                if (docs[IndexDb - 1]) {
                  setNext_Prev({next: true, prev: false});
                }
              }

              if (docs[IndexDb + 1]) {
                setNext_Prev({next: false, prev: true});
              }
            }
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
  }, [db, isReload]);

  const delete_parte_diario = () => {
    db.find({}, async function (err, docs) {
      if (err) {
        Alert.alert(err.message);
      }
      const dataBd = docs;

      db.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
          Alert.alert(err.message);
        }

        Alert.alert(`Se eliminaron ${numRemoved} registros guardados.`);

        dataBd.splice(IndexDb, 1);
        dataBd.map((data) => insertar(data));
        navigation.navigate('SignInScreen');
      });
    });
  };

  const obtener_labor = (IdLabor) => {
    const resul_labor = Labores.find((labor) => labor.IdLabor === IdLabor);
    return resul_labor.Nombre;
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
    db.find({}, async function (err, docs) {
      if (err) {
        Alert.alert(err.message);
      }
      const dataBd = docs;

      db.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
          Alert.alert(err.message);
        }

        Alert.alert(`Se eliminaron ${numRemoved} registros guardados.`);

        dataBd.splice(IndexDb, 1);
        dataBd.map((data, index) => {
          if (index === IndexDb) {
            console.log('final');
            const ParteDiario = {
              tipo: MisPartesDiarios[0].tipo,
              sector: MisPartesDiarios[0].sector,
              labores: LaboresAsignado,
            };

            const Mis_Parte_Diario = [];
            Mis_Parte_Diario.push(ParteDiario);

            return insertar([{Mis_Parte_Diario}]);
          } else {
            return insertar(data);
          }
        });
        setIsReload(true);
      });
    });
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
          Parte diario
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
                {MisPartesDiarios.map((parte_diario) => (
                  <>
                    <Text
                      style={styles.eliminar_parte_diario}
                      onPress={delete_parte_diario}>
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
                            <Text>{'\n'}</Text>
                            <Text>Desde la db</Text>
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
              }}></View>
          </ScrollView>
        </Animatable.View>
      </View>

      <View style={styles.btn_create_plantilla}>
        <View style={[styles.header, {marginBottom: 10}]}>
          <Button
            title="Anterior"
            color={next_prev.prev ? '#cdcdcd' : '#8FBF1D'}
            disabled={next_prev.prev}
            onPress={() => {
              setIndexDb(IndexDb - 1);
              setIsReload(true);
            }}
          />
          <Button
            title="Siguiente"
            color={next_prev.next ? '#cdcdcd' : '#8FBF1D'}
            disabled={next_prev.next}
            onPress={() => {
              setIndexDb(IndexDb + 1);
              setIsReload(true);
            }}
          />
        </View>
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
      />
    </>
  );
};

export default ParteDiarioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  footer: {
    height: 600,
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
});
