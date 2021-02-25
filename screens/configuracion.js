/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {LoaderSpinner} from '../components/loader/spiner-loader';
import LinearGradient from 'react-native-linear-gradient';
import {TipoRol} from '../components/configuracion/TIpoRol';
import {Haciendas} from '../components/configuracion/hacienda';
import {EjercicioFiscal} from '../components/configuracion/fiscal';
import {SectorConfig} from '../components/configuracion/sector';
import {PeriodoConfig} from '../components/configuracion/periodo';
import {Divicion} from '../components/configuracion/divicion';
import {LoginBtn} from '../components/elementos/login-btn';
/* BD LOCAL */
import {dbConfiguracion} from '../db-local/db-configuracion';
import {dbMaestra} from '../db-local/db-maestra';
/* API */

const Configuracion = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [isMaestra, setIsMaestra] = useState(false);
  const [confiAll, setConfiAll] = useState({
    rol: undefined,
    hacienda: undefined,
    fiscal: undefined,
    sector: undefined,
    periodo: undefined,
    divicion: undefined,
  });

  useEffect(() => {
    dbConfiguracion.find({}, async function (err, dataConfi) {
      err && Alert.alert(err.message);
      let dataFind = {
        rol: undefined,
        hacienda: undefined,
        fiscal: undefined,
        sector: undefined,
        periodo: undefined,
        divicion: undefined,
      };

      const obtenerSection = (section) => {
        if (dataConfi.length) {
          const sectionFind = dataConfi.find(
            (item) => item.section === section,
          );
          return sectionFind ? sectionFind.Nombre : '';
        }
      };

      dataFind.rol = obtenerSection('Rol');
      dataFind.hacienda = obtenerSection('Hacienda');
      dataFind.fiscal = obtenerSection('Fiscal');
      dataFind.sector = obtenerSection('Sector');
      dataFind.periodo = obtenerSection('Periodo');
      dataFind.divicion = obtenerSection('Divicion');
      setConfiAll(dataFind);
    });

    dbMaestra.find({}, async function (err, dataMaestra) {
      err && Alert.alert(err.message);
      setIsMaestra(dataMaestra.length ? true : false);
    });

    if (isReload) {
      setIsReload(false);
    }
  }, [isReload]);

  const renderBtnLogin = () => {
    const {rol, hacienda, fiscal, sector, periodo} = confiAll;
    if ((!rol || !hacienda || !fiscal || !sector || !periodo) && isMaestra) {
      return <LoginBtn navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.button}>
          <Text style={styles.subTitle}>Configuracion</Text>
          {loading ? (
            <LoaderSpinner />
          ) : (
            <>
              <TipoRol
                Rol={confiAll.rol}
                setLoading={setLoading}
                setIsReload={setIsReload}
              />

              <Haciendas
                Hacienda={confiAll.hacienda}
                setLoading={setLoading}
                setIsReload={setIsReload}
              />

              <EjercicioFiscal
                Fiscal={confiAll.fiscal}
                setLoading={setLoading}
                setIsReload={setIsReload}
              />

              <SectorConfig
                Sector={confiAll.sector}
                setLoading={setLoading}
                setIsReload={setIsReload}
              />

              <PeriodoConfig
                Periodo={confiAll.periodo}
                setLoading={setLoading}
                setIsReload={setIsReload}
              />

              <Divicion
                divicion={confiAll.divicion}
                setLoading={setLoading}
                setIsReload={setIsReload}
              />

              {renderBtnLogin()}

              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  const {rol, hacienda, fiscal, sector, periodo} = confiAll;
                  if (rol && hacienda && fiscal && sector && periodo) {
                    navigation.navigate('SignInScreen', {config: true});
                  } else {
                    Alert.alert('Completa la configuracion');
                  }
                }}>
                <LinearGradient
                  colors={['#EB9058', '#EB5443']}
                  style={styles.signIn}>
                  <Text style={[styles.text, {color: '#fff'}]}>
                    Volver Atras
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Configuracion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
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
  subTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    padding: 10,
  },
});
