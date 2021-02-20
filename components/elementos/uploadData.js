/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import {ModalScreen} from '../modal/modal';
import {SelectUpload} from '../parte-diario/select-Upload';
/* DB LOCAL */
import {dbParteDiario} from '../../db-local/db-parte-diario';
import {dbConfiguracion} from '../../db-local/db-configuracion';
import {dbMe} from '../../db-local/db-me';

export function UploadData({setIsLoading, fechaCtx, semana, year}) {
  const [me, setMe] = useState();
  const [config, setConfig] = useState({
    rol: undefined,
    hacienda: undefined,
    fiscal: undefined,
    sector: undefined,
    periodo: undefined,
    divicion: undefined,
  });
  const [isModal, setIsModal] = useState(false);
  const [UploadCuadrillas, setUploadCuadrillas] = useState();

  useEffect(() => {
    dbConfiguracion.find({}, async function (err, dataConfig) {
      err && Alert.alert(err.message);
      let dataFind = {
        rol: undefined,
        hacienda: undefined,
        fiscal: undefined,
        sector: undefined,
        periodo: undefined,
        divicion: undefined,
      };

      const obtenerSection = (section) => {
        if (dataConfig.length) {
          const sectionFind = dataConfig.find(
            (item) => item.section === section,
          );
          return sectionFind ? sectionFind.value : '';
        }
      };

      dataFind.rol = obtenerSection('Rol');
      dataFind.hacienda = obtenerSection('Hacienda');
      dataFind.fiscal = obtenerSection('Fiscal');
      dataFind.sector = obtenerSection('Sector');
      dataFind.periodo = obtenerSection('Periodo');
      dataFind.divicion = obtenerSection('Divicion');
      setConfig(dataFind);
    });

    dbMe.findOne({section: 'me'}, async function (err, dataMe) {
      err && Alert.alert(err.message);
      dataMe && setMe(dataMe.MyData);
    });
  }, []);

  const subir_datos = () => {
    dbParteDiario.find(
      {$not: {cuadrilla: 'undefined'}, dia: fechaCtx, semana},
      function (err, dataPD) {
        err && Alert.alert(err.message);
        const cuadrillas = [];
        for (let h = 0; h < dataPD.length; h++) {
          cuadrillas.push({select: false, cuadrilla: dataPD[h].cuadrilla});
        }

        setUploadCuadrillas(cuadrillas);
        cuadrillas.length
          ? setIsModal(true)
          : Alert.alert(`No existen partes diarios en: ${fechaCtx}`);
      },
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={subir_datos}
        style={[
          styles.signIn,
          {borderColor: '#009387', borderWidth: 1, marginTop: 15},
        ]}>
        <Text style={[styles.textSign, {color: '#009387'}]}>Subir datos</Text>
      </TouchableOpacity>

      <ModalScreen isModal={isModal} setIsModal={setIsModal}>
        <SelectUpload
          cuadrillas={UploadCuadrillas}
          setCuadrillas={setUploadCuadrillas}
          setIsLoading={setIsLoading}
          fechaCtx={fechaCtx}
          semana={semana}
          config={config}
          year={year}
          me={me}
        />
      </ModalScreen>
    </>
  );
}

const styles = StyleSheet.create({
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    borderColor: '#009387',
  },
  signIn: {
    width: '100%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
