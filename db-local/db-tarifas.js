import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbTarifas = new Datastore({
  filename: 'asyncStorageTarifas',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarTarifas(data) {
  dbTarifas.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log('SE INSERTO NUEVOS VALORES EN TARIFAS ' + newDoc);
  });
}
