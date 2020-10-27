import React, { useState, useEffect } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    Button,
    ScrollView,
    View
} from "react-native";
import { MessageAlert } from '../components/pequenos/message';
import { db } from '../db-local/config-db-local';
import { ModalScreen } from '../components/modal/modal';
import * as Animatable from 'react-native-animatable';

const ParteDiarioScreen = () => {

    const [isParteDiario, setIsParteDiario] = useState(true);
    const [isModal, setIsModal] = useState(false);
    const [isReload, setIsReload] = useState(false);
    const [isRender, setIsRender] = useState('');
    const [MisPartesDiarios, setMisPartesDiarios] = useState([]);
    const [Sectores, setSectores] = useState([]);
    const [LaboresAsignado, setLaboresAsignado] = useState([]);

    useEffect( () => {
        try {
            const fetchDb = () => {
                db.find({}, async function (err, docs) {
                    if(err){
                        Alert.alert(err.message);
                    }

                    if(docs[1]){
                        setIsParteDiario(false);
                        setMisPartesDiarios(docs[1].Mis_Parte_Diario);
                        setSectores(docs[0].Sectores);
                    }
                });
            }

            if(isReload){
                setIsReload(false);
            }

            fetchDb();
        } catch (error) {
            Alert.alert(error.message);
        }
    },[db, isReload]);

    const obtenerSector = (IdSector) => {
        if(Sectores.length > 0){
            const Result_Sector =  Sectores.find(sector => sector.IdSector === IdSector);
            return Result_Sector.Nombre + ' - ' + Result_Sector.Nombre_Hacienda;
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 20 }}>Parte diario</Text>

                <Animatable.View 
                    animation="fadeInUpBig"
                    style={styles.footer}
                >
                    <ScrollView>

                        {isParteDiario ? (
                            <MessageAlert background='#cce5ff' content='Por el momento no existe ningun parte diario.' />
                        ) : (
                            <>
                                {MisPartesDiarios.map(parte_diario => (
                                    <View style={styles.header}>
                                        <View style={styles.box}>
                                            <Text>
                                                <Text style={styles.label}>Sector: </Text>
                                                {obtenerSector(parte_diario.sector)}
                                            </Text>
                                        </View>
                                        <View style={styles.box}>
                                            <Text>
                                                <Text style={styles.label}>Tipo: </Text>
                                                {parte_diario.tipo}
                                            </Text>
                                        </View>
                                    </View>
                                ))}

                                <Button color='green' title='Agregar Labores' onPress={() => {
                                    setIsModal(true); 
                                    setIsRender('Agregar-labores');
                                }} />
                            </>
                        )}

                        <View style={{ borderBottom: 2, borderBottomColor: '#cdcdcd', borderBottomWidth: 2, padding: 10 }}></View>

                        <Button title='Crear Plantilla' onPress={() => {
                            setIsModal(true); 
                            setIsRender('Create-plantilla');
                        }} />
                    </ScrollView>
                </Animatable.View>
            </View>

            <ModalScreen isModal={isModal} setIsModal={setIsModal} setIsReload={setIsReload} render={isRender} setLaboresAsignado={setLaboresAsignado} />
        </>
    );
}

export default ParteDiarioScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#009387'
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    box: {
        width: 160,
        height: 100
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});