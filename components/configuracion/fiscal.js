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

export function EjercicioFiscal({Fiscal, setLoading, setIsReload}) {
  const [modal, setModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [fiscal, setFiscal] = useState([]);
  const [selectFiscal, setSelectFiscal] = useState({
    IdDetalleCatalogo: undefined,
    Valor1: undefined,
    Valor2: undefined,
  });

  useEffect(() => {
    dbConfiguracion.findOne({section: 'Fiscal'}, async function (
      err,
      dataConfig,
    ) {
      err && Alert.alert(err.message);
      dataConfig && setIsUpdate(true);
    });
  }, []);

  const getEjercicioFiscal = () => {
    setLoading(true);

    if (isUpdate) {
      dbConfiguracion.findOne({section: 'Fiscal'}, async function (
        err,
        dataConfig,
      ) {
        err && Alert.alert(err.message);

        setFiscal(dataConfig.dataAll);
        setModal(true);
      });
    } else {
      obtenerConfiguracion('token-static', 'EjercicioFiscal')
        .then((fiscal) => {
          if (fiscal.data.length) {
            setModal(true);
            setFiscal(fiscal.data);
            setSelectFiscal(
              fiscal.data.find((item) => `${item.Valor2}` === '2020'),
            );
            // ${new Date().getFullYear()} actualizar esta linea en production
          } else {
            Alert.alert('No hay datos de rol');
          }
        })
        .catch((error) => Alert.alert(error.message));
    }

    setLoading(false);
  };

  const obtenerFiscal = (year) => {
    const FiscalFind =
      fiscal.length && fiscal.find((item) => `${item.Valor2}` === `${year}`);
    return FiscalFind ? FiscalFind : 'Cargando...';
  };

  const save = () => {
    if (isUpdate) {
      dbConfiguracion.update(
        {section: 'Fiscal'},
        {
          $set: {
            IdDetalleCatalogo: selectFiscal.IdDetalleCatalogo,
            value: selectFiscal.Valor1,
            Nombre: selectFiscal.Valor2,
          },
        },
      );
    } else {
      InsertarConfiguracion({
        section: 'Fiscal',
        IdDetalleCatalogo: selectFiscal.IdDetalleCatalogo,
        value: selectFiscal.Valor1,
        Nombre: selectFiscal.Valor2,
        dataAll: fiscal,
      });
    }
    setModal(false);
    setIsReload(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => (fiscal.length ? setModal(true) : getEjercicioFiscal())}>
        <LinearGradient
          colors={[
            Fiscal ? '#009387' : '#0993B5',
            Fiscal ? '#009387' : '#C7C7C7',
          ]}
          style={styles.signIn}>
          <Text style={[styles.text, {color: '#fff'}]}>
            Ejercicio Fiscal: ({Fiscal ? Fiscal : 'Ninguno'})
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <ModalScreen isModal={modal} setIsModal={setModal}>
        <Text style={styles.tarea_text}>Años</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={fiscal}
            onValueChange={(itemValue) => {
              if (itemValue) {
                const obj = obtenerFiscal(itemValue);
                setSelectFiscal(obj);
              }
            }}>
            <Picker.Item label="** SELECCIONA **" value={''} />
            {fiscal
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
        <Text style={{marginBottom: 10}}>
          Si das click a guardar sin seleccionar alguna fecha, se guardara la
          asignado por defecto.
        </Text>

        <Button
          title={`Guardar Fiscal: (${selectFiscal.Valor2})`}
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
