import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

export const dbActEmpl = new Datastore({
  filename: 'asyncStorageActEmpl',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarActividadEmpleado(data) {
  dbActEmpl.insert(data, function (err, newDoc) {
    if (err) {
      console.log(err);
    }
    console.log(
      'SE INSERTO NUEVOS VALORES EN ACTIVIDADES - EMPLEADOS ' + newDoc,
    );
  });
}
