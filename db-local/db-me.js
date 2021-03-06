import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbMe = new Datastore({
  filename: 'asyncStorageMe',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarMe(data) {
  dbMe.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log('SE INSERTO NUEVOS VALORES EN YO ' + newDoc);
  });
}
