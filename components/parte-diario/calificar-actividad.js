import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
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
import {dbMaestra} from '../../db-local/db-maestra';

export function CalificarActividad({
  selectIdActiEmple,
  setIsModal,
  setIsReload,
  idSector,
}) {
  const [actvEmpld, setActvEmpld] = useState({
    actividad: 'Cargando',
  });
  const [lotes, setLotes] = useState([]);
  const [observaciones, setObservaciones] = useState();
  const [selectLote, setSelectLote] = useState();
  const [hectarea, setHectarea] = useState();
  const [updateSelect, setUpdateSelect] = useState(false);

  useEffect(() => {
    dbActEmpl.findOne({_id: selectIdActiEmple}, async function (
      err,
      dataActEmpl,
    ) {
      err && Alert.alert(err.message);
      setActvEmpld(dataActEmpl);
      setObservaciones(dataActEmpl.observaciones && dataActEmpl.observaciones);
      setHectarea(dataActEmpl.hectaria && dataActEmpl.hectaria);
      setSelectLote(dataActEmpl.lote && dataActEmpl.lote);
    });

    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);
      const result = dataMaestra[0].Lotes.filter(
        (item) => item.IdSector === idSector,
      );
      setLotes(result);
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

  const saveDataActividad = () => {
    if (hectarea && selectLote) {
      dbActEmpl.update(
        {_id: selectIdActiEmple},
        {
          $set: {
            hectaria: hectarea,
            lote: selectLote,
            observaciones: observaciones ? observaciones : 'none',
          },
        },
      );
      setIsModal(false);
      setIsReload(true);
    } else {
      Alert.alert('Campos vacios, vuelva a intentarlo');
    }
  };

  const renderSelect = () => {
    return (
      <View style={styles.select}>
        <Picker
          selectedValue={lotes}
          onValueChange={(itemValue) => setSelectLote(itemValue)}>
          {lotes.map((lote, index) => (
            <Picker.Item key={index} label={lote.Nombre} value={lote.IdLote} />
          ))}
        </Picker>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.head}>
        <Text style={styles.tarea_text}>Actividad ------{'>'}</Text>
        <Text style={styles.box_actividad}>{actvEmpld.actividad}</Text>
      </View>
      <View style={styles.box_tareas}>
        <View style={styles.row_tareas}>
          <Text style={styles.tarea_text}>Hectaria:</Text>
          <TextInput
            defaultValue={actvEmpld.hectaria && actvEmpld.hectaria}
            onChangeText={(value) => setHectarea(value)}
            style={styles.text_input}
            placeholder="Inserta hectareas"
          />
        </View>
      </View>

      <Text style={styles.tarea_text}>Lote:</Text>
      {actvEmpld.lote ? (
        <>
          <View style={[styles.head, {marginBottom: 20}]}>
            <Text>
              <Text style={styles.tarea_text}>Actual: </Text>
              {obtenerLote(actvEmpld.lote)}
            </Text>
            <Text
              style={styles.update_bottom}
              onPress={() => setUpdateSelect(!updateSelect)}>
              Cambiar
            </Text>
          </View>

          {updateSelect && renderSelect()}
        </>
      ) : (
        renderSelect()
      )}

      <Text style={styles.tarea_text}>Observaciones:</Text>
      <TextInput
        defaultValue={actvEmpld.observaciones && actvEmpld.observaciones}
        style={[styles.text_input, {height: 60, marginBottom: 20}]}
        placeholder="Escriba las observaciones: (opcional)"
        onChangeText={(value) => setObservaciones(value)}
      />

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
  },
  text_input: {
    borderWidth: 2,
    borderColor: '#cdcdcd',
    padding: 5,
    borderRadius: 10,
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
    borderColor: '#b08b05',
    color: '#b08b05',
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
