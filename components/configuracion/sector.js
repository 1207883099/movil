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
import {dbMaestra} from '../../db-local/db-maestra';
import LinearGradient from 'react-native-linear-gradient';
import {ModalScreen} from '../../components/modal/modal';
import {
  InsertarConfiguracion,
  dbConfiguracion,
} from '../../db-local/db-configuracion';
import {Picker} from '@react-native-picker/picker';

export function SectorConfig({Sector, setLoading, setIsReload}) {
  const [modal, setModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [sectores, setSectores] = useState([]);
  const [selectSector, setSelectSector] = useState({
    IdSector: undefined,
    Nombre: undefined,
    IdHacienda: undefined,
    Nombre_Hacienda: undefined,
  });

  useEffect(() => {
    dbConfiguracion.findOne({section: 'Sector'}, async function (
      err,
      dataConfig,
    ) {
      err && Alert.alert(err.message);
      dataConfig && setIsUpdate(true);
    });
  }, []);

  const getSectores = () => {
    setLoading(true);

    dbConfiguracion.findOne({section: 'Hacienda'}, async function (
      err,
      dataConfig,
    ) {
      err && Alert.alert(err.message);

      dbMaestra.find({}, async function (err, dataMaestra) {
        err && Alert.alert(err.message);
        setSectores(
          dataMaestra[0].Sectores.filter(
            (item) => item.IdHacienda === dataConfig.value,
          ),
        );
        setModal(true);
      });
    });

    setLoading(false);
  };

  const obtenerSector = (Nombre) => {
    const SectorFind =
      sectores.length && sectores.find((item) => item.Nombre === Nombre);
    return SectorFind ? SectorFind : 'Cargando...';
  };

  const save = () => {
    if (isUpdate) {
      dbConfiguracion.update(
        {section: 'Sector'},
        {
          $set: {
            IdSector: selectSector.IdSector,
            Nombre: selectSector.Nombre + ' - ' + selectSector.Nombre_Hacienda,
          },
        },
      );
    } else {
      InsertarConfiguracion({
        section: 'Sector',
        IdSector: selectSector.IdSector,
        Nombre: selectSector.Nombre + ' - ' + selectSector.Nombre_Hacienda,
      });
    }
    setModal(false);
    setIsReload(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => (sectores.length ? setModal(true) : getSectores())}>
        <LinearGradient
          colors={[
            Sector ? '#009387' : '#0993B5',
            Sector ? '#009387' : '#C7C7C7',
          ]}
          style={styles.signIn}>
          <Text style={[styles.text, {color: '#fff'}]}>
            Sector: ({Sector ? Sector : 'Ninguno'})
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <ModalScreen isModal={modal} setIsModal={setModal}>
        <Text style={styles.tarea_text}>Sectores</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={sectores}
            onValueChange={(itemValue) => {
              if (itemValue) {
                const obj = obtenerSector(itemValue);
                setSelectSector(obj);
              }
            }}>
            <Picker.Item label="** SELECCIONA **" value={''} />
            {sectores
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
          Si das click a guardar sin seleccionar alguna fecha, se guardara la
          asignado por defecto.
        </Text>

        <Button
          title={`Guardar Sector: (${selectSector.Nombre} - ${selectSector.Nombre_Hacienda})`}
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
