/* eslint-disable no-shadow */
import React, {useState} from 'react';
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
import {InsertarConfiguracion} from '../../db-local/db-configuracion';
import {Picker} from '@react-native-picker/picker';

export function Haciendas({Hacienda, setLoading, setIsReload}) {
  const [modal, setModal] = useState(false);
  const [haciendas, setHaciendas] = useState([]);
  const [selectHacienda, setSelectHacienda] = useState({
    IdHacienda: undefined,
    Nombre: undefined,
  });

  const getHaciendas = () => {
    setLoading(true);

    obtenerConfiguracion('token-static', 'Hacienda')
      .then((haciendas) => {
        if (haciendas.data.length) {
          setModal(true);
          setHaciendas(haciendas.data);
          setSelectHacienda(
            haciendas.data.find((item) => item.Nombre === 'COOPROCLEM'),
          );
        } else {
          Alert.alert('No hay datos de rol');
        }
      })
      .catch((error) => Alert.alert(error.message));

    setLoading(false);
  };

  const obtenerHacienda = (Nombre) => {
    const HaciendaFind =
      haciendas.length && haciendas.find((item) => item.Nombre === Nombre);
    return HaciendaFind ? HaciendaFind : 'Cargando...';
  };

  const save = () => {
    InsertarConfiguracion({
      section: 'Hacienda',
      value: selectHacienda.IdHacienda,
      Nombre: selectHacienda.Nombre,
    });
    setModal(false);
    setIsReload(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => (haciendas.length ? setModal(true) : getHaciendas())}>
        <LinearGradient
          colors={[
            Hacienda ? '#009387' : '#0993B5',
            Hacienda ? '#009387' : '#C7C7C7',
          ]}
          style={styles.signIn}>
          <Text style={[styles.text, {color: '#fff'}]}>
            Hacienda: ({Hacienda ? Hacienda : 'Ninguno'})
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <ModalScreen isModal={modal} setIsModal={setModal}>
        <Text style={styles.tarea_text}>Haciendas</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={haciendas}
            onValueChange={(itemValue) => {
              if (itemValue) {
                const hacienda = obtenerHacienda(itemValue);
                setSelectHacienda(hacienda);
              }
            }}>
            <Picker.Item label="** SELECCIONA **" value={''} />
            {haciendas
              .sort((a, b) => a.Nombre > b.Nombre)
              .map((rol, index) => (
                <Picker.Item
                  key={index}
                  label={rol.Nombre}
                  value={rol.Nombre}
                />
              ))}
          </Picker>
        </View>
        <Text style={{marginBottom: 10}}>
          Si das click a guardar sin seleccionar algun hacienda, se guardara la
          asignado por defecto.
        </Text>

        <Button
          title={`Guardar hacienda: (${selectHacienda.Nombre})`}
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
