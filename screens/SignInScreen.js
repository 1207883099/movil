import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
/* EMPIEZA DB LOCAL */
import {InsertarMaestra, dbMaestra} from '../db-local/db-maestra';
import {dbEntryHistory} from '../db-local/db-history-entry';
import {InsertarTarifas} from '../db-local/db-tarifas';
import {InsertarCargos} from '../db-local/db-cargos';
/* COMPONENTS */
import LinearGradient from 'react-native-linear-gradient';
import {MisDatos} from '../components/elementos/mis-datos';
import {FechaTrabajo} from '../components/elementos/semana-del-ano';
import {FechaContext} from '../components/context/fecha';
import {LoaderSpinner} from '../components/loader/spiner-loader';
import {DeleteData} from '../components/elementos/DeleteData';
import {UploadData} from '../components/elementos/uploadData';
import {MyUserContext} from '../components/context/MyUser';
/* FETCH API */
import {obtenerMaestra} from '../api/maestra';
// import {SubirParteDiario} from '../api/parte-diario';
import {obtenerCargos} from '../api/cargo';
import {obtenerTarifas} from '../api/tarifa';
/* HOOKS */
import {get_Semana_Del_Ano} from '../hooks/fechas';

const SignInScreen = ({navigation}) => {
  const {fechaCtx, setFechaCtx} = useContext(FechaContext);
  const {UserCtx} = useContext(MyUserContext);
  const [dataLocal, setDataLocal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [lastHistory, setLastHistory] = useState();

  useEffect(() => {
    try {
      const fetchDB = () => {
        dbMaestra.find({}, async function (err, docs) {
          err && Alert.alert(err.message);
          setDataLocal(docs);
        });
      };

      if (isReload) {
        setIsReload(false);
      }

      dbEntryHistory.find({}, async function (err, dataHistory) {
        err && Alert.alert(err.message);
        const ultimoHistory = dataHistory[dataHistory.length - 1];
        setLastHistory(ultimoHistory.semana);
      });

      fetchDB();
    } catch (error) {
      Alert.alert(error.message);
    }
  }, [isReload]);

  const bajar_maestra = async () => {
    setIsLoading(true);
    try {
      const maestra = await obtenerMaestra(UserCtx.token);
      if (maestra.data.My_Cuadrilla !== undefined) {
        InsertarMaestra([maestra.data]);
        Alert.alert('Se Obtuvo datos Maestra :)');

        const cargos = await obtenerCargos(UserCtx.token);
        cargos.data.length && InsertarCargos(cargos.data);

        const tarifas = await obtenerTarifas(UserCtx.token);
        tarifas.data.length && InsertarTarifas(tarifas.data);

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

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <MisDatos UserCtx={UserCtx} />
          <FechaTrabajo fechaCtx={fechaCtx} setFechaCtx={setFechaCtx} />
          <View style={styles.button}>
            {dataLocal.length > 0 ? (
              <>
                <DeleteData navigation={navigation} setIsReload={setIsReload} />

                <TouchableOpacity
                  style={styles.delete}
                  onPress={() =>
                    navigation.navigate('SignUpScreen', {test: 'probando'})
                  }>
                  <LinearGradient
                    colors={['#5982EB', '#A69649']}
                    style={styles.signIn}>
                    <Text style={[styles.textSign, {color: '#fff'}]}>
                      Ver Mis Cuadrilla
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.delete}
                  onPress={() => {
                    if (lastHistory !== get_Semana_Del_Ano()) {
                      Alert.alert(
                        'Has empezado otra semana, asegurate de limpiar los datos antes de terminar la semana..! ----- de lo contrario ya no podras ver ni gestionar los partes diarios, debido a que no pertenecen a esta semana.',
                      );
                    } else {
                      navigation.navigate('ParteDiario');
                    }
                  }}>
                  <LinearGradient
                    colors={['#69ABC9', '#69D6C9']}
                    style={styles.signIn}>
                    <Text style={[styles.textSign, {color: '#fff'}]}>
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
                    <Text style={[styles.textSign, {color: '#fff'}]}>
                      Bajar Maestra
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {isLoading && <LoaderSpinner />}
              </>
            )}

            {dataLocal.length > 0 && UserCtx.movil_ip !== undefined ? (
              <>
                <UploadData setIsLoading={setIsLoading} />
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
                    {borderColor: '#009387', borderWidth: 1, marginTop: 15},
                  ]}>
                  <Text style={[styles.textSign, {color: '#009387'}]}>
                    Volver ah iniciar session
                  </Text>
                </TouchableOpacity>
              )
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate('Configuracion')}
              style={[
                styles.signIn,
                {borderColor: '#009387', borderWidth: 1, marginTop: 15},
              ]}>
              <Text style={[styles.textSign, {color: '#009387'}]}>
                Configuracion
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default SignInScreen;

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
