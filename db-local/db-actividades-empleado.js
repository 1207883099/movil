import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbActEmpl = new Datastore({
  filename: 'asyncStorageActEmpl',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarActividadEmpleado(data) {
  dbActEmpl.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log(
      'SE INSERTO NUEVOS VALORES EN ACTIVIDADES - EMPLEADOS ' + newDoc,
    );
  });
}
