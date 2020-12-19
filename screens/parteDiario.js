import React, {useState, useEffect, useContext} from 'react';
import {Alert, StyleSheet, Text, Button, ScrollView, View} from 'react-native';
import {MessageAlert} from '../components/elementos/message';
import {dbMaestra} from '../db-local/db-maestra';
import {dbParteDiario} from '../db-local/db-parte-diario';
import EmpleadosAsignados from '../components/parte-diario/empleados-asginados';
import {dbCuadrillaPD} from '../db-local/db-cuadrilla-parte-diario';
import {PaginationParteDiario} from '../components/parte-diario/pagination';
import {GenerarTareaEmpleado} from '../components/parte-diario/generar-tarea-empleado';
import {ModalScreen} from '../components/modal/modal';
import * as Animatable from 'react-native-animatable';
import {getDia} from '../hooks/fechas';
import {FechaContext} from '../components/context/fecha';

const ParteDiarioScreen = ({navigation}) => {
  const {fechaCtx} = useContext(FechaContext);
  const [isParteDiario, setIsParteDiario] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [isRender, setIsRender] = useState('');
  const [IndexDb, setIndexDb] = useState(0);
  const [next_prev, setNext_Prev] = useState({next: false, prev: false});
  const [MisPartesDiarios, setMisPartesDiarios] = useState({
    _id: '',
    data: [],
    cuadrilla: undefined,
  });
  const [Sectores, setSectores] = useState([]);
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
        dbMaestra.find({}, async function (err, docs) {
          err && Alert.alert(err.message);

          if (IndexDb >= 0) {
            setSectores(docs[0].Sectores);
            setCuadrillas(docs[0].My_Cuadrilla);
          }
        });

        dbParteDiario.find({fecha: fechaCtx}, async function (err, docs) {
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
                DisponiblesParteDiario.length === 0 && disponibles.push(index);

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
      err && Alert.alert(err.message);

      Alert.alert(
        `Se elimino el registro con el _id ${_id + ' cantidad:' + numRemoved}.`,
      );
      navigation.navigate('SignInScreen');
    });
  };

  /*const obtener_labor = (IdLabor) => {
    if (Labores.length > 0) {
      const resul_labor = Labores.find((labor) => labor.IdLabor === IdLabor);
      return resul_labor.Nombre;
    }
  };*/

  const obtenerSector = (IdSector) => {
    if (Sectores.length > 0) {
      const Result_Sector = Sectores.find(
        (sector) => sector.IdSector === IdSector,
      );
      return Result_Sector.Nombre + ' - ' + Result_Sector.Nombre_Hacienda;
    }
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
          Parte diario:
          {' ' + getDia(new Date())}
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
                      <View style={[styles.box, {width: '75%'}]}>
                        <Text>
                          <Text style={styles.label}>Sector: </Text>
                          {obtenerSector(parte_diario.sector)}
                        </Text>
                      </View>
                      <View style={[styles.box, {width: 80}]}>
                        <Text>
                          <Text style={styles.label}>Tipo: </Text>
                          {parte_diario.tipo}
                        </Text>
                      </View>
                    </View>

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
                        setIsModal={setIsModal}
                        setIsRender={setIsRender}
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
});
