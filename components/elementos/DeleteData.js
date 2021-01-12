import React from 'react';
import {Alert, TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
/* DATABASE LOCAL */
import {dbMaestra} from '../../db-local/db-maestra';
import {dbEntryHistory} from '../../db-local/db-history-entry';
import {dbCuadrillaPD} from '../../db-local/db-cuadrilla-parte-diario';
import {dbActEmpl} from '../../db-local/db-actividades-empleado';
import {dbParteDiario} from '../../db-local/db-parte-diario';
import {dbCargos} from '../../db-local/db-cargos';
import {dbConfiguracion} from '../../db-local/db-configuracion';

export function DeleteData({navigation, setIsReload}) {
  const eliminar_datos = () => {
    Alert.alert(
      'Limpiar datos de aplicacion',
      'Asegurate haber subido los datos antes de pasar a limpiar la app',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel delete data'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dbMaestra.remove({}, {multi: true}, function (err) {
              err && Alert.alert(err.message);
            });

            dbParteDiario.remove({}, {multi: true}, function (err) {
              err && Alert.alert(err.message);
            });

            dbConfiguracion.remove({}, {multi: true}, function (err) {
              err && Alert.alert(err.message);
            });

            dbCargos.remove({}, {multi: true}, function (err) {
              err && Alert.alert(err.message);
            });

            dbActEmpl.remove({}, {multi: true}, function (err) {
              err && Alert.alert(err.message);
            });

            dbCuadrillaPD.remove({}, {multi: true}, function (err) {
              err && Alert.alert(err.message);
            });

            dbEntryHistory.remove({}, {multi: true}, function (err) {
              err && Alert.alert(err.message);
            });

            Alert.alert('Se limpiaron todo los datos de la aplicacion.');
            setIsReload(true);

            navigation.navigate('SplashScreen');
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <TouchableOpacity style={styles.delete} onPress={eliminar_datos}>
      <LinearGradient colors={['#EB9058', '#EB5443']} style={styles.signIn}>
        <Text style={[styles.textSign, {color: '#fff'}]}>Eliminar Todo</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
