/* eslint-disable no-shadow */
import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  View,
  Button,
} from 'react-native';
import {obtenerConfiguracion} from '../../api/configuracion';
import LinearGradient from 'react-native-linear-gradient';
import {ModalScreen} from '../../components/modal/modal';
import {
  InsertarConfiguracion,
  dbConfiguracion,
} from '../../db-local/db-configuracion';
import {Picker} from '@react-native-picker/picker';

export function PeriodoConfig({Periodo, setLoading, setIsReload}) {
  const [modal, setModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [periodos, setPeriodos] = useState([]);
  const [selectPeriodo, setSelectPeriodo] = useState({
    IdPeriodoNomina: undefined,
    EjercicioFiscal: undefined,
    Numero: undefined,
  });

  useEffect(() => {
    dbConfiguracion.findOne({section: 'Periodo'}, async function (
      err,
      dataConfig,
    ) {
      err && Alert.alert(err.message);
      dataConfig && setIsUpdate(true);
    });
  }, []);

  const getPeriodos = () => {
    setLoading(true);

    dbConfiguracion.find({}, async function (err, dataConfig) {
      err && Alert.alert(err.message);

      const fiscal = dataConfig.find((item) => item.section === 'Fiscal');
      const Rol = dataConfig.find((item) => item.section === 'Rol');

      if (fiscal && Rol) {
        obtenerConfiguracion(
          'token-static',
          'PeriodoNomina',
          fiscal.value,
          Rol.value,
        )
          .then((periodos) => {
            if (periodos.data.length) {
              setModal(true);
              setPeriodos(periodos.data);
            } else {
              Alert.alert('No hay datos de rol');
            }
          })
          .catch((error) => Alert.alert(error.message));
      } else {
        Alert.alert('Se necesita configurar Rol y fiscal antes que periodo.');
      }
    });

    setLoading(false);
  };

  const obtenerPeriodo = (Numero) => {
    const PeriodoFind =
      periodos.length && periodos.find((item) => item.Numero === Numero);
    return PeriodoFind ? PeriodoFind : 'Cargando...';
  };

  const save = () => {
    if (isUpdate) {
      dbConfiguracion.update(
        {section: 'Periodo'},
        {
          $set: {
            value: selectPeriodo.IdPeriodoNomina,
            Nombre: selectPeriodo.Numero,
          },
        },
      );
    } else {
      InsertarConfiguracion({
        section: 'Periodo',
        value: selectPeriodo.IdPeriodoNomina,
        Nombre: selectPeriodo.Numero,
      });
    }
    setModal(false);
    setIsReload(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => (periodos.length ? setModal(true) : getPeriodos())}>
        <LinearGradient
          colors={[
            Periodo ? '#009387' : '#0993B5',
            Periodo ? '#009387' : '#C7C7C7',
          ]}
          style={styles.signIn}>
          <Text style={[styles.text, {color: '#fff'}]}>
            Periodo: ({Periodo ? Periodo : 'Ninguno'})
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <ModalScreen isModal={modal} setIsModal={setModal}>
        <Text style={styles.tarea_text}>Periodos</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={periodos}
            onValueChange={(itemValue) => {
              if (itemValue) {
                const peri = obtenerPeriodo(itemValue);
                setSelectPeriodo(peri);
              }
            }}>
            <Picker.Item label="** SELECCIONA **" value={''} />
            {periodos
              .sort((a, b) => a.Numero > b.Numero)
              .map((rol, index) => (
                <Picker.Item
                  key={index}
                  label={rol.Numero}
                  value={rol.Numero}
                />
              ))}
          </Picker>
        </View>
        <Text style={{marginBottom: 10}}>
          Si das click a guardar sin seleccionar algun periodo, se guardara la
          asignado por defecto.
        </Text>

        <Button
          title={`Guardar Periodo: (${selectPeriodo.Numero})`}
          color="#009387"
          onPress={save}
        />
      </ModalScreen>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  signIn: {
    width: '100%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  tarea_text: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    marginTop: 15,
  },
  select: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cdcdcd',
    marginBottom: 10,
  },
});
