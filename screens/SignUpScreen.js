import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import {LoaderSpinner} from '../components/loader/spiner-loader';
import {dbMaestra} from '../db-local/db-maestra';
import {MessageAlert} from '../components/elementos/message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const SignInScreen = ({navigation}) => {
  const [misCuadrillas, setMisCuadrillas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const fetchTest = () => {
        dbMaestra.find({}, async function (err, dataMaestra) {
          err && Alert.alert(err.message);
          setMisCuadrillas(dataMaestra[0].My_Cuadrilla);
          setIsLoading(false);
        });
      };

      fetchTest();
    } catch (error) {
      Alert.alert(error.message);
    }

    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Tus Cuadrilla</Text>
        <View style={styles.button}>
          <TouchableOpacity
            style={{backgroundColor: '#fff', padding: 7, borderRadius: 15}}
            onPress={() => navigation.navigate('SignInScreen')}>
            <MaterialIcons name="navigate-before" color="#009387" size={25} />
            <Text style={{color: '#009387'}}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          {misCuadrillas.map((cuadrilla, index) => (
            <>
              <View key={index}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Nombre: "{cuadrilla.Nombre}"
                </Text>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  Estado: "{cuadrilla.Estado}"
                </Text>
              </View>
              {cuadrilla.Empleados.sort((a, b) => a.Apellido > b.Apellido).map(
                (empleado, index) => (
                  <View
                    style={{
                      padding: 10,
                      borderBottom: 2,
                      borderBottomStyle: 'solid',
                      borderBottomColor: '#cddcdcd',
                      borderBottomWidth: 2,
                    }}
                    key={index}>
                    <Text style={{color: '#000'}}>
                      Apellido: {empleado.Apellido}
                    </Text>
                    <Text style={{color: '#000'}}>
                      Nombre: {empleado.Nombre}
                    </Text>
                    <Text style={{color: '#000'}}>
                      Cedula: {empleado.Cedula}
                    </Text>
                    <Text style={{color: '#000'}}>
                      Codigo: {empleado.Codigo}
                    </Text>
                  </View>
                ),
              )}
            </>
          ))}

          {isLoading && <LoaderSpinner />}
          {misCuadrillas.length === 0 && (
            <MessageAlert
              background="#F0615D"
              content="No se encontraron datos para mostrar."
            />
          )}
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  button: {
    alignItems: 'flex-end',
  },
});
