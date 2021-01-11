import React from 'react';
import {Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
/* FETCH API */
import {obtenerMaestra} from '../../api/maestra';
// import {SubirParteDiario} from '../api/parte-diario';
import {obtenerCargos} from '../../api/cargo';
import {obtenerTarifas} from '../../api/tarifa';
/* DB LOCAL */
import {InsertarTarifas} from '../../db-local/db-tarifas';
import {InsertarMaestra} from '../../db-local/db-maestra';
import {InsertarCargos} from '../../db-local/db-cargos';

export function DownloadData({UserCtx, setIsLoading, setIsReload}) {
  const bajar_maestra = async () => {
    setIsLoading(true);
    try {
      const maestra = await obtenerMaestra(UserCtx.token);
      if (maestra.data.My_Cuadrilla !== undefined) {
        InsertarMaestra([maestra.data]);
        Alert.alert('Se Obtuvo datos Maestra :)');

        const cargos = await obtenerCargos(UserCtx.token);
        cargos.data.length && InsertarCargos(cargos.data);

        const tarifas = await obtenerTarifas(UserCtx.token);
        tarifas.data.length && InsertarTarifas(tarifas.data);

        setIsLoading(false);
        setIsReload(true);
      } else {
        Alert.alert('Datos vacios de la maestra :(');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setIsLoading(false);
  };

  return (
    <TouchableOpacity style={styles.signIn} onPress={bajar_maestra}>
      <LinearGradient colors={['#08d3c4', '#06ab9d']} style={styles.signIn}>
        <Text style={[styles.textSign, styles.colorWhite]}>Bajar Maestra</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  signIn: {
    width: '100%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  delete: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
