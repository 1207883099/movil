import React from 'react';
import {View, Button} from 'react-native';

export function PaginationParteDiario({
  next_prev,
  DisponiblesParteDiario,
  IndexDb,
  setIndexDb,
  setIsReload,
}) {
  const styles = {
    header: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  };

  return (
    <>
      <View style={[styles.header, {marginBottom: 10}]}>
        <Button
          title="Anterior"
          color={next_prev.prev ? '#cdcdcd' : '#8FBF1D'}
          disabled={
            DisponiblesParteDiario.length === 0
              ? true
              : DisponiblesParteDiario.findIndex(
                  (index) => index === DisponiblesParteDiario[0],
                ) === IndexDb
          }
          onPress={() => {
            setIndexDb(IndexDb - 1);
            setIsReload(true);
          }}
        />
        <Button
          title="Siguiente"
          color={next_prev.next ? '#cdcdcd' : '#8FBF1D'}
          disabled={
            DisponiblesParteDiario.length === 0
              ? true
              : DisponiblesParteDiario.findIndex(
                  (index) =>
                    index ===
                    DisponiblesParteDiario[DisponiblesParteDiario.length - 1],
                ) === IndexDb
          }
          onPress={() => {
            setIndexDb(IndexDb + 1);
            setIsReload(true);
          }}
        />
      </View>
    </>
  );
}
