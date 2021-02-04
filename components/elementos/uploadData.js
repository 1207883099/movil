/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
/* API */
import {SubirParteTrabajo} from '../../api/parteTrabajo';
/* DB LOCAL */
import {dbParteDiario} from '../../db-local/db-parte-diario';
import {dbConfiguracion} from '../../db-local/db-configuracion';
import {dbActEmpl} from '../../db-local/db-actividades-empleado';
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
      setMe(dataMe.MyData);
    });
  }, []);

  const subir_datos = async () => {
    setIsLoading(true);
    try {
      dbParteDiario.find(
        {$not: {cuadrilla: 'undefined'}, dia: fechaCtx, semana},
        async function (err, dataPD) {
          err && Alert.alert(err.message);
          if (dataPD.length) {
            let Upload = [];
            for (let i = 0; i < dataPD.length; i++) {
              const parteTrabajo = SchemaParteTrabajo(dataPD[i]);

              dbActEmpl.find({idParteDiario: dataPD[i]._id}, async function (
                err,
                dataActividad,
              ) {
                err && Alert.alert(err.message);
                for (let j = 0; j < dataActividad.length; j++) {
                  parteTrabajo.ParteTrabajoDetalle.push({
                    IdActividad: dataActividad[j].actividad,
                    IdEmpleado: dataActividad[j].idEmpleado,
                    CodigoEmpleado: dataActividad[j].CodigoEmpleado,
                    Total: dataActividad[j].valorTotal,
                    Valor: dataActividad[j].hectaria,
                    Tarifa: dataActividad[j].ValorTarifa,
                    isLote: dataActividad[j].isLote,
                    lotes: [],
                  });

                  let item;
                  for (let k = 0; k < dataActividad[j].lotes.length; k++) {
                    item = dataActividad[j].lotes;

                    parteTrabajo.ParteTrabajoDetalle[j].lotes.push({
                      Lote: item[k].Nombre,
                      IdLote: item[k].IdLote,
                      Valor: item[k].value,
                    });
                  }
                }
              });
              Upload.push(parteTrabajo);
            }

            //console.log(await Upload[0].ParteTrabajoDetalle[0]);

            const isUpload = await SubirParteTrabajo(Upload);

            if (isUpload.data.upload) {
              Alert.alert(
                `Datos subidos: Parte Trabajo ${fechaCtx}, sem ${semana} del ${year}`,
              );
              dbParteDiario.update(
                {dia: fechaCtx, semana},
                {$set: {'Mis_Parte_Diario[0].nube': true}},
              );
              setIsLoading(false);
            }

            if (isUpload.data.feedback) {
              Alert.alert(
                `Ocurrio un error al subir los datos, ${isUpload.data.feedback}.`,
              );
              setIsLoading(false);
            }
          } else {
            Alert.alert('No existen partes diarios');
            setIsLoading(false);
          }
        },
      );
    } catch (error) {
      Alert.alert(error.message);
      setIsLoading(false);
    }
  };

  const SchemaParteTrabajo = (dataPd) => {
    const ParteTrabajo = {
      codigo: '00000001',
      Division: config.divicion,
      EjercicioFiscal: config.fiscal,
      Fecha: dataPd.fecha,
      IdMayordomo: me.id_Empleado,
      IdPeriodo: config.periodo,
      IdTipoRol: config.rol,
      IdHacienda: config.hacienda,
      IdSector: config.sector,
      ParteTrabajoDetalle: [],
    };
    return ParteTrabajo;
  };

  return (
    <TouchableOpacity
      onPress={subir_datos}
      style={[
        styles.signIn,
        {borderColor: '#009387', borderWidth: 1, marginTop: 15},
      ]}>
      <Text style={[styles.textSign, {color: '#009387'}]}>Subir datos</Text>
    </TouchableOpacity>
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
