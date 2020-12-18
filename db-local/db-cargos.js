import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

export const dbCargos = new Datastore({
  filename: 'asyncStorageCargos',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarCargos(data) {
  dbCargos.insert(data, function (err, newDoc) {
    if (err) {
      console.log(err);
    }
    console.log('SE INSERTO NUEVOS VALORES EN CARGOS ' + newDoc);
  });
}
