import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

export const dbMe = new Datastore({
  filename: 'asyncStorageMe',
  storage: AsyncStorage,
  autoload: true,
});
