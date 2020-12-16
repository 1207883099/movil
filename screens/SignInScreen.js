import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {LoaderSpinner} from '../components/loader/spiner-loader';
import {connect} from 'react-redux';
import {InsertarMaestra, dbMaestra} from '../db-local/db-maestra';
import {dbParteDiario} from '../db-local/db-parte-diario';
import LinearGradient from 'react-native-linear-gradient';
import {MisDatos} from '../components/elementos/mis-datos';
import {obtenerMaestra} from '../api/maestra';
import {SubirParteDiario} from '../api/parte-diario';
import {FechaTrabajo} from '../components/elementos/semana-del-ano';
import {FechaContext} from '../components/context/fecha';

const SignInScreen = ({navigation, UsuarioReducer}) => {
  const {fechaCtx, setFechaCtx} = useContext(FechaContext);
  const [dataLocal, setDataLocal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    try {
      const fetchDB = () => {
        dbMaestra.find({}, async function (err, docs) {
          if (err) {
            Alert.alert(err.message);
          }
          setDataLocal(docs);
        });
      };

      if (isReload) {
        setIsReload(false);
      }

      fetchDB();
    } catch (error) {
      Alert.alert(error.message);
    }
  }, [isReload]);

  const bajar_maestra = async () => {
    setIsLoading(true);
    try {
      const maestra = await obtenerMaestra(UsuarioReducer.MyUser[0].token);
      if (maestra.data.My_Cuadrilla !== undefined) {
        InsertarMaestra([maestra.data]);
        Alert.alert('Se Obtuvo datos Maestra :)');
        setIsLoading(false);
        setIsReload(true);
      } else {
        Alert.alert('Datos vacios de la maestra :(');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setIsLoading(false);
  };

  const eliminar_datos = () => {
    dbMaestra.remove({}, {multi: true}, function (err) {
      if (err) {
        Alert.alert(err.message);
        return;
      }
      setIsReload(true);
    });

    dbParteDiario.remove({}, {multi: true}, function (err) {
      if (err) {
        Alert.alert(err.message);
        return;
      }
      setIsReload(true);
    });

    Alert.alert('Se limpiaron todo los datos de maestra y partes diarios.');

    navigation.navigate('SplashScreen');
  };

  const subir_datos = async () => {
    setIsLoading(true);
    try {
      dbMaestra.find({}, async function (err, docs) {
        if (err) {
          Alert.alert(err.message);
        }

        if (docs.some((data, index) => docs[index].Mis_Parte_Diario)) {
          const partes_diario = docs.filter(
            (data, index) => docs[index].Mis_Parte_Diario,
          );
          const resParteDiario = await SubirParteDiario(partes_diario);

          if (resParteDiario.data.upload) {
            Alert.alert(
              `EXITO, se acabo de subir: ${partes_diario.length} partes diarios`,
            );
            eliminar_datos();
          } else {
            Alert.alert(
              'ERROR, algo acabo de fallar al momento de subir los parte diarios.',
            );
          }
        } else {
          Alert.alert(
            'No tienes datos que subir, crea y gestionar parte diarios y luego vuelve.',
          );
        }
      });

      setIsLoading(false);
    } catch (error) {
      Alert.alert(error.message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <MisDatos UsuarioReducer={UsuarioReducer} />
          <FechaTrabajo fechaCtx={fechaCtx} setFechaCtx={setFechaCtx} />
          <View style={styles.button}>
            {dataLocal.length > 0 ? (
              <>
                <TouchableOpacity
                  style={styles.delete}
                  onPress={eliminar_datos}>
                  <LinearGradient
                    colors={['#EB9058', '#EB5443']}
                    style={styles.signIn}>
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: '#fff',
                        },
                      ]}>
                      Eliminar Datos
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.delete}
                  onPress={() =>
                    navigation.navigate('SignUpScreen', {test: 'probando'})
                  }>
                  <LinearGradient
                    colors={['#5982EB', '#A69649']}
                    style={styles.signIn}>
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: '#fff',
                        },
                      ]}>
                      Ver Mis Cuadrilla
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.delete}
                  onPress={() => navigation.navigate('ParteDiario')}>
                  <LinearGradient
                    colors={['#69ABC9', '#69D6C9']}
                    style={styles.signIn}>
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: '#fff',
                        },
                      ]}>
                      Gestionar Parte Diario
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View
                  style={{
                    padding: 10,
                    borderBottom: 2,
                    borderBottomColor: '#cdcdcd',
                    borderBottomWidth: 2,
                    marginBottom: 10,
                  }}>
                  <Text style={{fontWeight: 'bold'}}>
                    Estas opciones son mostradas por que se detectaron datos
                    guardados.
                  </Text>
                </View>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.signIn} onPress={bajar_maestra}>
                  <LinearGradient
                    colors={['#08d3c4', '#06ab9d']}
                    style={styles.signIn}>
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: '#fff',
                        },
                      ]}>
                      Bajar Maestra
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {isLoading && <LoaderSpinner />}
              </>
            )}

            {dataLocal.length > 0 &&
            UsuarioReducer.MyUser[0].movil_ip !== undefined ? (
              <>
                <TouchableOpacity
                  onPress={subir_datos}
                  style={[
                    styles.signIn,
                    {
                      borderColor: '#009387',
                      borderWidth: 1,
                      marginTop: 15,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#009387',
                      },
                    ]}>
                    Subir datos
                  </Text>
                </TouchableOpacity>
                {isLoading && <LoaderSpinner />}
              </>
            ) : (
              dataLocal.length > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('SplashScreen', {login: true})
                  }
                  style={[
                    styles.signIn,
                    {
                      borderColor: '#009387',
                      borderWidth: 1,
                      marginTop: 15,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#009387',
                      },
                    ]}>
                    Volver ah iniciar session
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const mapStateToProps = ({UsuarioReducer}) => {
  return {UsuarioReducer};
};

export default connect(mapStateToProps, null)(SignInScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 70,
  },
  signIn: {
    width: '100%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  delete: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
