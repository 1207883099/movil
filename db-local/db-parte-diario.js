import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

export const dbMaestra = new Datastore({
  filename: 'asyncStorageParteDiario',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarParteDiario(data) {
  dbMaestra.insert(data, function (err, newDoc) {
    if (err) {
      console.log(err);
    }
    console.log('SE INSERTO UN NUEVO VALOR DE PARTE DIARIO' + newDoc);
  });
}
