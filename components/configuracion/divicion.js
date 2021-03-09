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

export function Divicion({divicion, setLoading, setIsReload}) {
  const [modal, setModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [divi, setDivi] = useState([]);
  const [selectDivicion, setSelectDivicion] = useState({
    IdDetalleCatalogo: undefined,
    Valor1: undefined,
    Valor2: undefined,
  });

  useEffect(() => {
    dbConfiguracion.findOne(
      {section: 'Divicion'},
      async function (err, dataConfig) {
        err && Alert.alert(err.message);
        dataConfig && setIsUpdate(true);
      },
    );
  }, []);

  const getDivicion = () => {
    setLoading(true);

    if (isUpdate) {
      dbConfiguracion.findOne(
        {section: 'Divicion'},
        async function (err, dataConfig) {
          err && Alert.alert(err.message);

          setDivi(dataConfig.dataAll);
          setModal(true);
        },
      );
    } else {
      obtenerConfiguracion('token-static', 'Divicion')
        .then((fiscal) => {
          if (fiscal.data.length) {
            setModal(true);
            setDivi(fiscal.data);
            setSelectDivicion(
              fiscal.data.find((item) => item.Valor2 === 'Banano'),
            );
          } else {
            Alert.alert('No hay datos de divicion');
          }
        })
        .catch((error) => Alert.alert(error.message));
    }

    setLoading(false);
  };

  const obtenerDivicion = (valor2) => {
    const FiscalFind =
      divi.length && divi.find((item) => item.Valor2 === valor2);
    return FiscalFind ? FiscalFind : 'Cargando...';
  };

  const save = () => {
    if (isUpdate) {
      dbConfiguracion.update(
        {section: 'Divicion'},
        {
          $set: {
            IdDetalleCatalogo: selectDivicion.IdDetalleCatalogo,
            value: selectDivicion.Valor1,
            Nombre: selectDivicion.Valor2,
          },
        },
      );
    } else {
      InsertarConfiguracion({
        section: 'Divicion',
        IdDetalleCatalogo: selectDivicion.IdDetalleCatalogo,
        value: selectDivicion.Valor1,
        Nombre: selectDivicion.Valor2,
        dataAll: divi,
      });
    }

    setModal(false);
    setIsReload(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => (divi.length ? setModal(true) : getDivicion())}>
        <LinearGradient
          colors={[
            divicion ? '#009387' : '#0993B5',
            divicion ? '#009387' : '#C7C7C7',
          ]}
          style={styles.signIn}>
          <Text style={[styles.text, {color: '#fff'}]}>
            División: ({divicion ? divicion : 'Ninguno'})
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <ModalScreen isModal={modal} setIsModal={setModal}>
        <Text style={styles.tarea_text}>Diviciones</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={divi}
            onValueChange={(itemValue) => {
              if (itemValue) {
                const obj = obtenerDivicion(itemValue);
                setSelectDivicion(obj);
              }
            }}>
            <Picker.Item label="** SELECCIONA **" value={''} />
            {divi
              .sort((a, b) => a.Valor2 > b.Valor2)
              .map((rol, index) => (
                <Picker.Item
                  key={index}
                  label={rol.Valor2}
                  value={rol.Valor2}
                />
              ))}
          </Picker>
        </View>

        <Button
          title={`Guardar Divicion: (${selectDivicion.Valor2})`}
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
