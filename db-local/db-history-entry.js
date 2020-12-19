import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

export const dbEntryHistory = new Datastore({
  filename: 'asyncStorageEntryHistory',
  storage: AsyncStorage,
  autoload: true,
});

export function InsertarEntry(data) {
  dbEntryHistory.insert(data, function (err, newDoc) {
    if (err) {
      console.log(err);
    }
    console.log('SE INSERTO NUEVOS VALORES EN ENTRY HISTORY ' + newDoc);
  });
}
