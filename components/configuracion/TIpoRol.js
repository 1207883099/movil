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

export function TipoRol({Rol, setLoading, setIsReload}) {
  const [modal, setModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectRol, setSelectRol] = useState({
    IdTipoRol: undefined,
    Nombre: undefined,
  });

  const getRoles = () => {
    setLoading(true);

    obtenerConfiguracion('token-static', 'TipoRol')
      .then((roles) => {
        if (roles.data.length) {
          setModal(true);
          setRoles(roles.data);
          setSelectRol(roles.data.find((item) => item.Nombre === 'Rol Banano'));
        } else {
          Alert.alert('No hay datos de rol');
        }
      })
      .catch((error) => Alert.alert(error.message));

    setLoading(false);
  };

  const obtenerRol = (Nombre) => {
    const rolFind =
      roles.length && roles.find((item) => item.Nombre === Nombre);
    return rolFind ? rolFind : 'Cargando...';
  };

  const save = () => {
    InsertarConfiguracion({
      section: 'Rol',
      value: selectRol.IdTipoRol,
      Nombre: selectRol.Nombre,
    });
    setModal(false);
    setIsReload(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => (roles.length ? setModal(true) : getRoles())}>
        <LinearGradient
          colors={[Rol ? '#009387' : '#0993B5', Rol ? '#009387' : '#C7C7C7']}
          style={styles.signIn}>
          <Text style={[styles.text, {color: '#fff'}]}>
            Tipo de Rol: ({Rol ? Rol : 'Ninguno'})
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <ModalScreen isModal={modal} setIsModal={setModal}>
        <Text style={styles.tarea_text}>Roles</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={roles}
            onValueChange={(itemValue) => {
              if (itemValue) {
                const rol = obtenerRol(itemValue);
                setSelectRol(rol);
              }
            }}>
            <Picker.Item label="** SELECCIONA **" value={''} />
            {roles
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
          Si das click a guardar sin seleccionar algun rol, se guardara el rol
          asignado por defecto.
        </Text>

        <Button
          title={`Guardar Rol: (${selectRol.Nombre})`}
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
