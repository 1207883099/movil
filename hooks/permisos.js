import {PermissionsAndroid, Platform} from 'react-native';

export const isPermitted = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs access to Storage data',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      alert('Write permission err', err);
      return false;
    }
  } else {
    return true;
  }
};
