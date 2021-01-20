/* eslint-disable react-native/no-inline-styles */
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
import {dbMaestra} from '../db-local/db-maestra';
import {dbConfiguracion} from '../db-local/db-configuracion';
/* COMPONENTS */
import LinearGradient from 'react-native-linear-gradient';
import {FechaTrabajo} from '../components/elementos/semana-del-ano';
import {FechaContext} from '../components/context/fecha';
import {LoaderSpinner} from '../components/loader/spiner-loader';
import {DeleteData} from '../components/elementos/DeleteData';
import {UploadData} from '../components/elementos/uploadData';
import {DownloadData} from '../components/elementos/downloadData';
import {MyUserContext} from '../components/context/MyUser';
import {LoginBtn} from '../components/elementos/login-btn';

const SignInScreen = ({navigation}) => {
  const {fechaCtx, setFechaCtx} = useContext(FechaContext);
  const {UserCtx} = useContext(MyUserContext);
  const [dataLocal, setDataLocal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [isConfig, setIsConfig] = useState(false);
  const [fiscal, setFiscal] = useState({
    valuie: undefined,
    Nombre: undefined,
  });
  const [periodo, setPeriodo] = useState({
    Nombre: undefined,
  });

  useEffect(() => {
    try {
      dbMaestra.find({}, async function (err, dataMaestra) {
        err && Alert.alert(err.message);
        setDataLocal(dataMaestra);
      });

      dbConfiguracion.find({}, async function (err, dataConfig) {
        err && Alert.alert(err.message);
        setIsConfig(dataConfig.length === 6 ? false : true);
        if (dataConfig.length === 6) {
          setFiscal(dataConfig.find((item) => item.section === 'Fiscal'));
          setPeriodo(dataConfig.find((item) => item.section === 'Periodo'));
        } else {
          navigation.navigate('Configuracion');
        }
      });

      if (isReload) {
        setIsReload(false);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }, [isReload, navigation]);

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <FechaTrabajo
            fechaCtx={fechaCtx}
            setFechaCtx={setFechaCtx}
            semana={periodo.Nombre}
            year={fiscal.Nombre}
          />
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
                    <Text style={[styles.textSign, styles.colorWhite]}>
                      Ver Mis Cuadrillas
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.delete}
                  onPress={() =>
                    isConfig
                      ? navigation.navigate('Configuracion')
                      : navigation.navigate('ParteDiario')
                  }>
                  <LinearGradient
                    colors={['#69ABC9', '#69D6C9']}
                    style={styles.signIn}>
                    <Text style={[styles.textSign, styles.colorWhite]}>
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
                {isLoading ? (
                  <LoaderSpinner />
                ) : (
                  <DownloadData
                    UserCtx={UserCtx}
                    setIsLoading={setIsLoading}
                    setIsReload={setIsReload}
                  />
                )}
              </>
            )}

            {dataLocal.length > 0 && UserCtx.movil_ip !== undefined ? (
              <>
                {isLoading ? (
                  <LoaderSpinner />
                ) : (
                  <UploadData
                    setIsLoading={setIsLoading}
                    fechaCtx={fechaCtx}
                    semana={periodo.Nombre}
                    year={fiscal.Nombre}
                  />
                )}
              </>
            ) : (
              dataLocal.length > 0 && <LoginBtn navigation={navigation} />
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
  colorWhite: {
    color: '#fff',
  },
});
