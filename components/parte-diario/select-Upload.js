import React, {useEffect, useState} from 'react';
import {View, Text, CheckBox, StyleSheet, Button, Alert} from 'react-native';
import {AddCeraIteracion} from '../../hooks/iteracion';
/* API */
import {
  SubirParteTrabajo,
  SubirParteTrabajoDetalles,
  SubirParteTrabajoDetallesValor,
} from '../../api/parteTrabajo';
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
    console.log(NameCuadrilla);
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
            for (let i = 0; i < dataPD.length; i++) {
              const PD_select = cuadrillas.find(
                (item) => item.cuadrilla === dataPD[i].cuadrilla,
              );

              if (PD_select !== undefined && PD_select.select) {
                dbActEmpl.find(
                  {idParteDiario: dataPD[i]._id},
                  async function (err, dataActividad) {
                    err && Alert.alert(err.message);
                    const parteTrabajo = SchemaParteTrabajo(dataPD[i]);
                    const {IdParteTrabajo, feedback} = await (
                      await SubirParteTrabajo(parteTrabajo)
                    ).data;

                    if (feedback) {
                      Alert.alert(
                        `Ocurrio un error al subir los datos, ${feedback}.`,
                      );
                      setIsLoading(false);
                      return false;
                    }

                    if (IdParteTrabajo) {
                      for (let j = 0; j < dataActividad.length; j++) {
                        if (dataActividad[j].hectaria) {
                          const ParteTrabajoDetalle = {
                            IdActividad: dataActividad[j].actividad,
                            IdEmpleado: dataActividad[j].idEmpleado,
                            CodigoEmpleado: dataActividad[j].CodigoEmpleado,
                            Total: dataActividad[j].valorTotal,
                            Valor: dataActividad[j].hectaria,
                            Tarifa: dataActividad[j].ValorTarifa,
                            IdParteTrabajo,
                            IdCuadrilla: parteTrabajo.IdCuadrilla,
                            Codigo: parteTrabajo.Codigo,
                          };

                          const {IdParteTrabajoDetalle, feedback} = await (
                            await SubirParteTrabajoDetalles(ParteTrabajoDetalle)
                          ).data;

                          if (feedback) {
                            Alert.alert(
                              `Ocurrio un error al subir los datos, ${feedback}.`,
                            );
                            setIsLoading(false);
                            return false;
                          }

                          if (IdParteTrabajoDetalle) {
                            const dataLotes = dataActividad[j].lotes;

                            for (let k = 0; k < dataLotes.length; k++) {
                              let item = dataLotes;
                              const thisLotes = [];

                              thisLotes.push({
                                Lote: item[k].Nombre,
                                IdLote: item[k].IdLote,
                                Valor: item[k].value,
                              });

                              const {upload, feedback} = await (
                                await SubirParteTrabajoDetallesValor(
                                  thisLotes,
                                  IdParteTrabajoDetalle,
                                )
                              ).data;

                              if (feedback) {
                                Alert.alert(
                                  `Ocurrio un error al subir los datos, ${feedback}.`,
                                );
                                setIsLoading(false);
                                return false;
                              }

                              if (dataLotes.length - 1 === k && upload) {
                                Alert.alert(
                                  `Subiendo Datos... Parte Trabajo ${fechaCtx}, sem ${semana} del ${year}`,
                                );
                              }
                            }
                          }
                        }

                        if (dataActividad.length - 1 === j) {
                          Alert.alert(
                            `Datos Subidos al servidor: ${fechaCtx}, sem ${semana} del ${year}`,
                          );
                        }
                      }
                    }

                    setIsLoading(false);
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
      Codigo: AddCeraIteracion(dataPd.iteracion),
      Division: config.divicion,
      EjercicioFiscal: config.fiscal,
      Fecha: dataPd.fecha,
      IdMayordomo: me.id_Empleado,
      IdPeriodo: config.periodo,
      IdTipoRol: config.rol,
      IdHacienda: config.hacienda,
      IdSector: config.sector,
      IdCuadrilla: obtenerIdCuadrilla(cuadrillas[0].cuadrilla),
    };

    return ParteTrabajo;
  };

  const handleChange = (value, cuadrilla) => {
    const changeValue = {select: value, cuadrilla};
    console.log(cuadrillas.splice(0, cuadrillas.length, changeValue));
    setCuadrillas(cuadrillas.splice(0, cuadrillas.length, changeValue));
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
