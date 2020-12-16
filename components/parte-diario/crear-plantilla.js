import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {dbMaestra} from '../../db-local/db-maestra';
import {InsertarParteDiario} from '../../db-local/db-parte-diario';

export function CrearPlantilla({setIsModal, setIsReload, navigation}) {
  const [selectTipo, setSelectTipo] = useState('Cultivo');
  const [selectSectorValue, setSectorValue] = useState(0);
  const [sectores, setSectores] = useState([]);

  useEffect(() => {
    try {
      const fetchDB = () => {
        dbMaestra.find({}, async function (err, docs) {
          if (err) {
            Alert.alert(err.message);
          }
          setSectores(docs[0].Sectores);
        });
      };

      fetchDB();
    } catch (error) {
      Alert.alert(error.message);
    }
  }, []);

  const create_Template_Parte_Diario = () => {
    if (selectSectorValue !== 0) {
      const ParteDiario = {
        tipo: selectTipo,
        sector: selectSectorValue,
        labores: [
          {
            labor: 'ninguno',
            Asignado: [
              {
                Empleado: 'ninguno',
                observacion: 'ninguno',
                tareas: [
                  {
                    Actividad: 'ninguno',
                    Hectarea: 'ninguno',
                    Lote: 'ninguno',
                  },
                  {
                    Actividad: 'ninguno',
                    Hectarea: 'ninguno',
                    Lote: 'ninguno',
                  },
                  {
                    Actividad: 'ninguno',
                    Hectarea: 'ninguno',
                    Lote: 'ninguno',
                  },
                ],
              },
            ],
          },
        ],
      };

      const Mis_Parte_Diario = [];
      Mis_Parte_Diario.push(ParteDiario);

      InsertarParteDiario({
        Mis_Parte_Diario,
        fecha: new Date().toDateString(),
      });
      setIsModal(false);
      setIsReload(true);
      navigation.navigate('SignInScreen');
    } else {
      Alert.alert('Seleccione el sector en la seccion de sectores.');
    }
  };

  return (
    <>
      <Text style={styles.modalText}>Selecciona los datos necesarios.</Text>

      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.select}>
        <Picker
          selectedValue={selectTipo}
          onValueChange={(itemValue) => setSelectTipo(itemValue)}>
          <Picker.Item label="Cultivo" value="Cultivo" />
          <Picker.Item label="Cosecha" value="Cosecha" />
        </Picker>
      </View>

      <Text style={styles.label}>Sectores:</Text>
      <View style={styles.select}>
        <Picker
          selectedValue={sectores}
          onValueChange={(itemValue) => setSectorValue(itemValue)}>
          {sectores.map((sector, index) => (
            <Picker.Item
              key={index}
              label={sector.Nombre + ' - ' + sector.Nombre_Hacienda}
              value={sector.IdSector}
            />
          ))}
        </Picker>
      </View>

      <Button
        title="Guardar plantilla"
        onPress={create_Template_Parte_Diario}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  select: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cdcdcd',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: 15,
  },
});
