import React from 'react';
import {Alert, TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
/* DATABASE LOCAL */
import {dbEntryHistory} from '../../db-local/db-history-entry';
import {dbConfiguracion} from '../../db-local/db-configuracion';
import {dbMaestra} from '../../db-local/db-maestra';
import {dbCuadrillaPD} from '../../db-local/db-cuadrilla-parte-diario';
import {dbActEmpl} from '../../db-local/db-actividades-empleado';
import {dbParteDiario} from '../../db-local/db-parte-diario';
import {dbMe} from '../../db-local/db-me';

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
          onPress: () => DeleteMaestra(),
        },
      ],
      {cancelable: false},
    );
  };

  const deleteConfig = () => {
    Alert.alert(
      'Por ultimo',
      '¿Deseas eliminar los datos de configuracion?',
      [
        {
          text: 'No',
          onPress: () => eliminar_part_dia_and_recurrente(),
          style: 'cancel',
        },
        {
          text: 'Si',
          onPress: () => {
            dbConfiguracion.remove({}, {multi: true}, function (err) {
              err && Alert.alert(err.message);
            });
            eliminar_part_dia_and_recurrente();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const DeleteMaestra = () => {
    Alert.alert(
      'Antes de eliminar...',
      '¿Deseas eliminar los datos de la maestra?',
      [
        {
          text: 'No',
          onPress: () => deleteConfig(),
          style: 'cancel',
        },
        {
          text: 'Si',
          onPress: () => {
            dbMaestra.remove({}, {multi: true}, function (err) {
              err && Alert.alert(err.message);
            });
            deleteConfig();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const eliminar_part_dia_and_recurrente = () => {
    dbParteDiario.remove({}, {multi: true}, function (err) {
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

    dbMe.remove({}, {multi: true}, function (err) {
      err && Alert.alert(err.message);
    });

    Alert.alert(
      'Se limpiaron todo los datos de Parte Diarios y datos recurrentes.',
    );
    setIsReload(true);

    navigation.navigate('SplashScreen');
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
