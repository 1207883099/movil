import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbCuadrillaPD = new Datastore({
  filename: 'asyncStorageCuadrillaPD',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarCuadrillaPD(data) {
  dbCuadrillaPD.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log('SE INSERTO UN NUEVO VALOR EN CUADRILLA PD' + newDoc);
  });
}
