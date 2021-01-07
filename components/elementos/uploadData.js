import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';

export function UploadData() {
  const subir_datos = async ({setIsLoading}) => {
    setIsLoading(true);
    /*try {
          dbMaestra.find({}, async function (err, docs) {
            if (err) {
              Alert.alert(err.message);
            }

            if (docs.some((data, index) => docs[index].Mis_Parte_Diario)) {
              const partes_diario = docs.filter(
                (data, index) => docs[index].Mis_Parte_Diario,
              );
              const resParteDiario = await SubirParteDiario(partes_diario);

              if (resParteDiario.data.upload) {
                Alert.alert(
                  `EXITO, se acabo de subir: ${partes_diario.length} partes diarios`,
                );
                eliminar_datos();
              } else {
                Alert.alert(
                  'ERROR, algo acabo de fallar al momento de subir los parte diarios.',
                );
              }
            } else {
              Alert.alert(
                'No tienes datos que subir, crea y gestionar parte diarios y luego vuelve.',
              );
            }
          });

          setIsLoading(false);
        } catch (error) {
          Alert.alert(error.message);
        }*/

    setIsLoading(false);
    Alert.alert('Esta accion aun no esta programada.');
  };

  return (
    <TouchableOpacity onPress={subir_datos} style={styles.signIn}>
      <Text style={[styles.textSign, {color: '#009387'}]}>Subir datos</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    borderColor: '#009387',
    borderWidth: 1,
    marginTop: 15,
  },
});
