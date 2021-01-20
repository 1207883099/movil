/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
/* DB LOCAL */
import {dbActEmpl} from '../../db-local/db-actividades-empleado';
import {dbTarifas} from '../../db-local/db-tarifas';
import {dbMaestra} from '../../db-local/db-maestra';

export function CalificarActividad({
  selectIdActiEmple,
  setIsModal,
  setIsReload,
  setReloadEmplAsig,
  idSector,
}) {
  const [actvEmpld, setActvEmpld] = useState({
    actividad: 'Cargando',
  });
  const [lotes, setLotes] = useState([]);
  const [Actividades, setActividades] = useState([]);
  const [Tarifas, setTarifas] = useState({
    Minimo: undefined,
    Maximo: undefined,
    ValorTarifa: undefined,
  });
  const [selectLote, setSelectLote] = useState();
  const [hectarea, setHectarea] = useState(0);
  const [isLote, setIsLote] = useState(false);
  const [updateSelect, setUpdateSelect] = useState(false);

  useEffect(() => {
    dbActEmpl.findOne({_id: selectIdActiEmple}, async function (
      err,
      dataActEmpl,
    ) {
      err && Alert.alert(err.message);
      setActvEmpld(dataActEmpl);
      setIsLote(dataActEmpl.isLote);
      setSelectLote(dataActEmpl.lote && dataActEmpl.lote);
      setHectarea(dataActEmpl.hectaria ? dataActEmpl.hectaria : 0);

      dbTarifas.findOne({IdActividad: dataActEmpl.actividad}, async function (
        err,
        dataTarifas,
      ) {
        err && Alert.alert(err.message);
        setTarifas(dataTarifas);
      });
    });

    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);
      const result = dataMaestra[0].Lotes.filter(
        (item) => item.IdSector === idSector,
      );
      setLotes(result);
      setActividades(dataMaestra[0].Actividades);
    });
  }, [idSector, selectIdActiEmple]);

  const obtenerLote = (IdLote) => {
    const result = lotes.find((item) => item.IdLote === IdLote);
    if (result === undefined) {
      return 'cargando....';
    } else {
      return result.Nombre;
    }
  };

  const obtenerActividad = (idActividad, propiedad) => {
    if (Actividades.length) {
      const Actividad = Actividades.find(
        (activi) => activi.IdActividad === idActividad,
      );
      if (Actividad) {
        return propiedad === 'ActividadId'
          ? Actividad.IdActividad
          : Actividad.Nombre;
      } else {
        return 'Cargando...';
      }
    }
  };

  const renderLotes = () => {
    return (
      <>
        <View
          style={{
            borderBottom: 2,
            borderBottomColor: '#cdcdcd',
            borderBottomWidth: 2,
            padding: 10,
          }}
        />
        <Text style={styles.tarea_text}>Lotes:</Text>
        {lotes.map((lote) => (
          <View style={[styles.head, {marginBottom: 10}]}>
            <View>
              <Text>{lote.Nombre}</Text>
            </View>
            <View>
              <TextInput
                defaultValue={actvEmpld.hectaria && actvEmpld.hectaria}
                onChangeText={(value) =>
                  setHectarea(
                    hectarea ? hectarea + Number(value) : 0 + Number(value),
                  )
                }
                style={styles.text_input}
                placeholder="Insertar valor"
              />
            </View>
          </View>
        ))}
      </>
    );
  };

  const saveDataActividad = () => {
    if (hectarea) {
      if (hectarea >= Tarifas.Minimo && hectarea <= Tarifas.Maximo) {
        dbActEmpl.update(
          {_id: selectIdActiEmple},
          {
            $set: {
              hectaria: hectarea,
              lote: selectLote + 7,
              valorTotal: (Tarifas.ValorTarifa * hectarea).toFixed(2),
            },
          },
        );

        setIsModal(false);
        setIsReload(true);
        setReloadEmplAsig(true);
      } else {
        Alert.alert('Los valores no estan dentro del rango permitido');
      }
    } else {
      Alert.alert('Campos vacios, vuelva a intentarlo');
    }
  };

  return (
    <ScrollView>
      <View style={styles.head}>
        <Text style={styles.tarea_text}>Actividad ------{'>'}</Text>
        <Text
          style={[
            styles.box_actividad,
            {borderColor: '#b08b05', color: '#b08b05'},
          ]}>
          {obtenerActividad(actvEmpld.actividad, 'Nombre')}
        </Text>
      </View>
      <View style={styles.head}>
        <Text style={styles.tarea_text}>Hectaria ------{'>'}</Text>
        <Text
          style={[
            styles.box_actividad,
            {borderColor: 'royalblue', color: 'royalblue'},
          ]}>
          # {hectarea.toFixed(2)}
        </Text>
      </View>
      <View style={styles.head}>
        <Text style={styles.tarea_text}>Valor total ------{'>'}</Text>
        <Text
          style={[
            styles.box_actividad,
            {borderColor: '#009387', color: '#009387'},
          ]}>
          $ {(Tarifas.ValorTarifa * hectarea).toFixed(2)}
        </Text>
      </View>

      <View style={styles.head}>
        <Text>Minimo: {Tarifas.Minimo}</Text>
        <Text>Maximo: {Tarifas.Maximo}</Text>
      </View>

      {!actvEmpld.hectaria && isLote ? (
        renderLotes()
      ) : (
        <View style={{marginBottom: 10}}>
          <View style={{marginTop: 10}}>
            <TextInput
              defaultValue={actvEmpld.hectaria && actvEmpld.hectaria}
              onChangeText={(value) => setHectarea(Number(value))}
              style={styles.text_input}
              placeholder="Insertar valor"
            />
          </View>
        </View>
      )}

      <Button title="Guardar" color="#009387" onPress={saveDataActividad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box_tareas: {
    padding: 2,
    marginBottom: 15,
    marginTop: 5,
  },
  row_tareas: {
    padding: 10,
  },
  tarea_text: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  text_input: {
    borderWidth: 2,
    borderColor: '#cdcdcd',
    padding: 5,
    borderRadius: 10,
    width: '100%',
  },
  select: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cdcdcd',
    marginBottom: 10,
  },
  box_actividad: {
    width: 90,
    height: 29,
    textAlign: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 12,
    marginTop: 10,
  },
  head: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  update_bottom: {
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 2,
    borderColor: '#b08b05',
    color: '#b08b05',
    borderStyle: 'solid',
  },
});
