import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbParteDiario = new Datastore({
  filename: 'asyncStorageParteDiario',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarParteDiario(data) {
  dbParteDiario.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log('SE INSERTO UN NUEVO VALOR DE PARTE DIARIO' + newDoc);
  });
}
