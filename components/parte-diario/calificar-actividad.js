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
import NumericInput from 'react-native-numeric-input';
import {trunc} from '../../helpers/truncar';
/* DB LOCAL */
import {dbActEmpl} from '../../db-local/db-actividades-empleado';
import {dbTarifas} from '../../db-local/db-tarifas';
import {dbMaestra} from '../../db-local/db-maestra';

export function CalificarActividad({
  selectIdActiEmple,
  selectEmpleado,
  setIsModal,
  setIsReload,
  setReloadEmplAsig,
  idSector,
}) {
  const [actvEmpld, setActvEmpld] = useState({
    actividad: 'Cargando',
    hectaria: 0,
  });
  const [lotes, setLotes] = useState([]);
  const [Actividades, setActividades] = useState([]);
  const [Tarifas, setTarifas] = useState({
    Minimo: undefined,
    Maximo: undefined,
    ValorTarifa: undefined,
  });
  //const [selectLote, setSelectLote] = useState();
  const [hectarea, setHectarea] = useState(0);
  const [isLote, setIsLote] = useState(false);
  //const [updateSelect, setUpdateSelect] = useState(false);

  useEffect(() => {
    dbActEmpl.findOne(
      {_id: selectIdActiEmple},
      async function (err, dataActEmpl) {
        err && Alert.alert(err.message);
        setActvEmpld(dataActEmpl);
        setIsLote(dataActEmpl.isLote);
        setHectarea(dataActEmpl.hectaria ? dataActEmpl.hectaria : 0);
        setLotes(dataActEmpl.lotes);

        dbTarifas.findOne(
          {IdActividad: dataActEmpl.actividad},
          async function (err, dataTarifas) {
            err && Alert.alert(err.message);
            setTarifas(dataTarifas);
          },
        );
      },
    );

    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);
      setActividades(dataMaestra[0].Actividades);
    });
  }, [idSector, selectIdActiEmple]);

  useEffect(() => {
    if (lotes.length) {
      let suma = lotes.reduce((total, b) => total + Number(b.value), 0);
      setHectarea(suma);
    }
  }, [lotes]);

  const obtenerLote = (IdLote) => {
    const result = lotes.find((item) => item.IdLote === IdLote);
    if (result === undefined) {
      return 'Sin Lote';
    } else {
      return result;
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
        {lotes.map((lote, index) => (
          <View
            style={[
              styles.head,
              {marginBottom: 10, justifyContent: 'space-around'},
            ]}
            key={index}>
            <View>
              <Text>{lote.Nombre}</Text>
            </View>
            <View>
              <NumericInput
                value={lote.value && lote.value}
                onChange={(value) => {
                  const thisLote = obtenerLote(lote.IdLote);
                  thisLote.value = Number(value);
                  setLotes(lotes.splice(0, lotes.length, thisLote));
                  value = 0;
                }}
                onLimitReached={(isMax) =>
                  isMax && Alert.alert('Limite maximo alcanzado')
                }
                totalWidth={100}
                totalHeight={30}
                iconSize={20}
                step={1}
                valueType="real"
                textColor="#009387"
                iconStyle={{color: 'white'}}
                rightButtonBackgroundColor="#009387"
                leftButtonBackgroundColor="#009387"
              />
            </View>
          </View>
        ))}
      </>
    );
  };

  const saveDataActividad = () => {
    if (
      (hectarea >= Tarifas.Minimo && hectarea <= Tarifas.Maximo) ||
      hectarea === 0
    ) {
      dbActEmpl.update(
        {_id: selectIdActiEmple},
        {
          $set: {
            hectaria: trunc(hectarea, 2),
            lotes: lotes,
            valorTotal: trunc(Tarifas.ValorTarifa * hectarea, 2),
          },
        },
      );

      setIsModal(false);
      setIsReload(true);
      setReloadEmplAsig(true);
    } else {
      Alert.alert('Los valores no estan dentro del rango permitido');
    }
  };

  return (
    <ScrollView>
      <View style={[styles.head, {justifyContent: 'space-between'}]}>
        <Text style={styles.tarea_text}>Empleado ------{'>'}</Text>
        <Text style={{borderColor: '#000', color: '#000'}}>
          {selectEmpleado}
        </Text>
      </View>

      <View style={[styles.head, {justifyContent: 'space-between'}]}>
        <Text style={styles.tarea_text}>Actividad ------{'>'}</Text>
        <Text style={{borderColor: '#b08b05', color: '#b08b05'}}>
          {obtenerActividad(actvEmpld.actividad, 'Nombre')}
        </Text>
      </View>

      <View style={[styles.head, {justifyContent: 'space-between'}]}>
        <Text style={styles.tarea_text}>Hectaria ------{'>'}</Text>
        <Text style={{borderColor: 'royalblue', color: 'royalblue'}}>
          # {hectarea.toFixed(2)}
        </Text>
      </View>

      <View
        style={[styles.head, {marginTop: 10, justifyContent: 'space-around'}]}>
        <Text>Minimo: {Tarifas.Minimo}</Text>
        <Text>Maximo: {Tarifas.Maximo}</Text>
      </View>

      <View style={{margin: 15}}>
        <Button title="Guardar" color="#009387" onPress={saveDataActividad} />
      </View>

      {isLote ? (
        renderLotes()
      ) : (
        <View
          style={[
            styles.head,
            {justifyContent: 'space-around', marginBottom: 10},
          ]}>
          {actvEmpld.actividad !== 'Cargando' && (
            <NumericInput
              value={actvEmpld.hectaria}
              onChange={(value) => setHectarea(Number(value))}
              totalWidth={150}
              totalHeight={50}
              iconSize={20}
              step={1}
              valueType="real"
              textColor="#009387"
              iconStyle={{color: 'white'}}
              rightButtonBackgroundColor="#009387"
              leftButtonBackgroundColor="#009387"
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tarea_text: {
    fontSize: 14,
    fontWeight: 'bold',
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
  },
  head: {
    flex: 1,
    flexDirection: 'row',
  },
});
