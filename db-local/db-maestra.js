import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbMaestra = new Datastore({
  filename: 'asyncStorageMaestra',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarMaestra(data) {
  dbMaestra.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log('SE INSERTO UN NUEVO VALOR ' + newDoc);
  });
}
