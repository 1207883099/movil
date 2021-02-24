import React, {useEffect, useState} from 'react';
import {View, Text, CheckBox, StyleSheet, Button, Alert} from 'react-native';
/* API */
import {SubirParteTrabajo} from '../../api/parteTrabajo';
/* DB LOCAL */
import {dbParteDiario} from '../../db-local/db-parte-diario';
import {dbActEmpl} from '../../db-local/db-actividades-empleado';
import {dbMaestra} from '../../db-local/db-maestra';

export const SelectUpload = ({
  cuadrillas,
  setCuadrillas,
  setIsLoading,
  fechaCtx,
  semana,
  config,
  me,
  year,
}) => {
  const [MisCuadrillas, setMisCuadrillas] = useState();

  useEffect(() => {
    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);
      setMisCuadrillas(dataMaestra[0].My_Cuadrilla);
    });
  }, []);

  const obtenerIdCuadrilla = (NameCuadrilla) => {
    if (MisCuadrillas.length) {
      const findCuadrilla = MisCuadrillas.find(
        (item) => item.Nombre === NameCuadrilla,
      );
      return findCuadrilla.IdCuadrilla;
    }
  };

  const UploadData = async () => {
    const isSelected = cuadrillas.filter((item) => item.select === false);

    if (isSelected.length === cuadrillas.length) {
      Alert.alert('Selecciona las cuadrillas que se subiran');
      return false;
    }

    setIsLoading(true);

    try {
      dbParteDiario.find(
        {$not: {cuadrilla: 'undefined'}, dia: fechaCtx, semana},
        async function (err, dataPD) {
          err && Alert.alert(err.message);
          if (dataPD.length) {
            let Upload = [];
            for (let i = 0; i < dataPD.length; i++) {
              const PD_select = cuadrillas.find(
                (item) => item.cuadrilla === dataPD[i].cuadrilla,
              );

              if (PD_select !== undefined && PD_select.select) {
                let parteTrabajo;

                dbActEmpl.find(
                  {idParteDiario: dataPD[i]._id},
                  async function (err, dataActividad) {
                    err && Alert.alert(err.message);
                    parteTrabajo = SchemaParteTrabajo(dataPD[i]);

                    for (let j = 0; j < dataActividad.length; j++) {
                      if (dataActividad[j].hectaria) {
                        parteTrabajo.IdCuadrilla = obtenerIdCuadrilla(
                          dataPD[i].cuadrilla,
                        );
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

                        for (
                          let k = 0;
                          k < dataActividad[j].lotes.length;
                          k++
                        ) {
                          let item = dataActividad[j].lotes;

                          parteTrabajo.ParteTrabajoDetalle[j].lotes.push({
                            Lote: item[k].Nombre,
                            IdLote: item[k].IdLote,
                            Valor: item[k].value,
                          });
                        }
                      } else {
                        parteTrabajo.ParteTrabajoDetalle.push(null);
                      }
                    }

                    Upload.push(parteTrabajo);

                    if (i === dataPD.length - 1) {
                      try {
                        const isUpload = await SubirParteTrabajo(Upload);

                        if (isUpload.data.upload) {
                          Alert.alert(
                            `Datos subidos: Parte Trabajo ${fechaCtx}, sem ${semana} del ${year}`,
                          );
                          setIsLoading(false);
                        }

                        if (isUpload.data.feedback) {
                          Alert.alert(
                            `Ocurrio un error al subir los datos, ${isUpload.data.feedback}.`,
                          );
                          setIsLoading(false);
                        }
                      } catch (error) {
                        Alert.alert(error.message);
                        setIsLoading(false);
                      }
                    }
                  },
                );
              }
            }
          } else {
            Alert.alert(`No existen partes diarios de: ${fechaCtx}`);
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
      codigo: dataPd.iteracion,
      Division: config.divicion,
      EjercicioFiscal: config.fiscal,
      Fecha: dataPd.fecha,
      IdMayordomo: me.id_Empleado,
      IdPeriodo: config.periodo,
      IdTipoRol: config.rol,
      IdHacienda: config.hacienda,
      IdSector: config.sector,
      IdCuadrilla: '',
      ParteTrabajoDetalle: [],
    };

    return ParteTrabajo;
  };

  const handleChange = (value, cuadrilla) => {
    const changeValue = {select: value, cuadrilla};
    const changeCuadrillas = [];
    for (let i = 0; i < cuadrillas.length; i++) {
      if (cuadrilla === cuadrillas[i].cuadrilla) {
        changeCuadrillas.push(changeValue);
      } else {
        changeCuadrillas.push(cuadrillas[i]);
      }
    }

    setCuadrillas(changeCuadrillas);
  };

  return (
    <View style={styles.container}>
      {cuadrillas.map((item) => (
        <View style={styles.checkboxContainer} key={item.cuadrilla}>
          <CheckBox
            value={item.select}
            onValueChange={(value) => handleChange(value, item.cuadrilla)}
            style={styles.checkbox}
          />
          <Text style={styles.label}>{item.cuadrilla}</Text>
        </View>
      ))}

      <Button
        color="#009387"
        title="Subir los seleccionados"
        onPress={UploadData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});
