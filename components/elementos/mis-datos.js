import React from 'react';
import {View, Text} from 'react-native';

export function MisDatos({UserCtx}) {
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
                {UserCtx.movil_ip === undefined
                  ? 'Indefinido'
                  : UserCtx.movil_ip}
              </Text>
            </Text>
            <Text>
              Ingreso el:{' '}
              <Text style={{fontWeight: 'bold'}}>
                {UserCtx.fecha_ingreso === undefined
                  ? 'Indefinido'
                  : UserCtx.fecha_ingreso}
              </Text>
            </Text>
          </View>
          <View>
            <Text>
              Nombres:{' '}
              <Text style={{fontWeight: 'bold'}}>
                {UserCtx.Nombre === undefined ? 'Indefinido' : UserCtx.Nombre}
              </Text>
            </Text>
            <Text>
              Apellidos:{' '}
              <Text style={{fontWeight: 'bold'}}>
                {UserCtx.Apellido === undefined
                  ? 'Indefinido'
                  : UserCtx.Apellido}
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
