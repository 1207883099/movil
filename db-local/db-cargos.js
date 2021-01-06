import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbCargos = new Datastore({
  filename: 'asyncStorageCargos',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarCargos(data) {
  dbCargos.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log('SE INSERTO NUEVOS VALORES EN CARGOS ' + newDoc);
  });
}
