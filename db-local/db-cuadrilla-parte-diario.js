import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

export const dbCuadrillaPD = new Datastore({
  filename: 'asyncStorageCuadrillaPD',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarCuadrillaPD(data) {
  dbCuadrillaPD.insert(data, function (err, newDoc) {
    if (err) {
      console.log(err);
    }
    console.log('SE INSERTO UN NUEVO VALOR EN CUADRILLA PD' + newDoc);
  });
}
