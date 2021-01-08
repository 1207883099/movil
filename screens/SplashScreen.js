import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
/* COMPONENTS */
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import {NetworkInfo} from 'react-native-network-info';
import {LoaderSpinner} from '../components/loader/spiner-loader';
import {MyUserContext} from '../components/context/MyUser';
/* DB LOCAL */
import {dbMaestra} from '../db-local/db-maestra';
import {dbEntryHistory, InsertarEntry} from '../db-local/db-history-entry';
/* FETCH API */
import {Auth} from '../api/usuario';
import {getDomain, setDomain} from '../api/config';
/* FECHAS */
import {get_Semana_Del_Ano} from '../hooks/fechas';

const SplashScreen = ({navigation, route}) => {
  const {setUserCtx} = useContext(MyUserContext);
  const {colors} = useTheme();
  const netInfo = useNetInfo();
  const [isLogind, setIsLogind] = useState(false);

  useEffect(() => {
    !netInfo.isConnected &&
      Alert.alert('Necesitas conneccion a internet para bajar o subir datos.');

    if (route.params === undefined) {
      dbEntryHistory.find({}, async function (err, dataHistory) {
        err && Alert.alert(err.message);
        if (dataHistory.length) {
          const ultimoHistory = dataHistory[dataHistory.length - 1];
          if (ultimoHistory.semana !== get_Semana_Del_Ano()) {
            Alert.alert(
              'Has empezado otra semana, asegurate de limpiar los datos antes de terminar la semana..! ----- de lo contrario ya no podras ver ni gestionar los partes diarios, debido a que no pertenecen a esta semana.',
            );
          }
        }

        dbMaestra.find({}, async function (err, docs) {
          err && Alert.alert(err.message);

          if (docs.length > 0) {
            navigation.navigate('SignInScreen');
          }
        });
      });
    }
  }, [netInfo, route, navigation]);

  const btn_empezar = async () => {
    setIsLogind(true);
    if (getDomain()) {
      if (getDomain().indexOf('https') !== -1) {
        try {
          NetworkInfo.getIPAddress()
            .then(async (ip) => {
              const auth = await Auth(ip);
              if (auth.data.feedback) {
                Alert.alert(auth.data.feedback);
              } else {
                InsertarEntry({semana: get_Semana_Del_Ano()});
                setUserCtx(auth.data.MyUser);
                navigation.navigate('SignInScreen');
              }
            })
            .catch((err) => Alert.alert(err.message), setIsLogind(false));
        } catch (error) {
          setIsLogind(false);
          Alert.alert(error.message);
        }
      } else {
        Alert.alert('Inserta una URL valida.');
      }
    } else {
      Alert.alert('Inserta la URL de autorizacion.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
          Inserta la direccion autorizada
        </Text>
        <TextInput
          onChangeText={(value) => setDomain(value)}
          style={styles.input}
          type="url"
          placeholder="Inserta la URL autorizada"
        />
      </View>
      {isLogind && <LoaderSpinner color="white" />}
      <Animatable.View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}
        animation="fadeInUpBig">
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}>
          Cooperativa de produccion y comercializacion "La clementina"
        </Text>
        <Text style={styles.text}>Procede a iniciar session</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={btn_empezar}>
            <LinearGradient
              colors={['#08d4c4', '#01ab9d']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Empezar</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SplashScreen;

///// Styles ....

const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 5,
    width: '80%',
    color: '#fff',
    marginTop: 15,
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: '#05375a',
    fontSize: 27,
    fontWeight: 'bold',
  },
  text: {
    color: 'grey',
    marginTop: 5,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
  },
});
