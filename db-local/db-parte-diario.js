import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

export const dbParteDiario = new Datastore({
  filename: 'asyncStorageParteDiario',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarParteDiario(data) {
  dbParteDiario.insert(data, function (err, newDoc) {
    if (err) {
      console.log(err);
    }
    console.log('SE INSERTO UN NUEVO VALOR DE PARTE DIARIO' + newDoc);
  });
}
