import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbAllEmpleados = new Datastore({
  filename: 'asyncStorageAllEmpleados',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarAllEmpleados(data) {
  dbAllEmpleados.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log('SE INSERTO NUEVOS VALORES EN ALL EMPLEADOS ' + newDoc);
  });
}
