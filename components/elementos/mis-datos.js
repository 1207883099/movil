import React from 'react';
import {View, Text} from 'react-native';

export function MisDatos({UsuarioReducer}) {
  return (
    <>
      <View style={{padding: 10, backgroundColor: '#cdcdcd'}}>
        <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
          Mis Datos
        </Text>
        <View style={styles.header}>
          <View>
            <Text>
              Ip Movil:{' '}
              <Text style={{fontWeight: 'bold'}}>
                {UsuarioReducer.MyUser[0].movil_ip === undefined
                  ? 'Indefinido'
                  : UsuarioReducer.MyUser[0].movil_ip}
              </Text>
            </Text>
            <Text>
              Ingreso el:{' '}
              <Text style={{fontWeight: 'bold'}}>
                {UsuarioReducer.MyUser[0].fecha_ingreso === undefined
                  ? 'Indefinido'
                  : UsuarioReducer.MyUser[0].fecha_ingreso}
              </Text>
            </Text>
          </View>
          <View>
            <Text>
              Nombres:{' '}
              <Text style={{fontWeight: 'bold'}}>
                {UsuarioReducer.MyUser[0].Nombre === undefined
                  ? 'Indefinido'
                  : UsuarioReducer.MyUser[0].Nombre}
              </Text>
            </Text>
            <Text>
              Apellidos:{' '}
              <Text style={{fontWeight: 'bold'}}>
                {UsuarioReducer.MyUser[0].Apellido === undefined
                  ? 'Indefinido'
                  : UsuarioReducer.MyUser[0].Apellido}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = {
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};
