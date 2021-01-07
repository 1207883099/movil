import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbConfiguracion = new Datastore({
  filename: 'asyncStorageConfi',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarConfiguracion(data) {
  dbConfiguracion.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log('SE INSERTO NUEVOS VALORES EN CONFIGURACION ' + newDoc);
  });
}
