import React from 'react';
import {View, ActivityIndicator} from 'react-native';

export function LoaderSpinner({color}) {
  return (
    <>
      <View
        style={{
          flex: 0.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={color ? color : '#009387'} size="large" />
      </View>
    </>
  );
}
