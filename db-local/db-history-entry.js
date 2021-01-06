import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const dbEntryHistory = new Datastore({
  filename: 'asyncStorageEntryHistory',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarEntry(data) {
  dbEntryHistory.insert(data, function (err, newDoc) {
    err && Alert.alert(err);
    console.log('SE INSERTO NUEVOS VALORES EN ENTRY HISTORY ' + newDoc);
  });
}
