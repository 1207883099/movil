import React, { useState, useEffect } from 'react';
import { 
    View,
    Text,
    Platform,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import { LoaderSpinner } from '../components/loader/spiner-loader';
import { db } from '../db-local/config-db-local';
import { MessageAlert } from '../components/pequenos/message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const SignInScreen = ({navigation}) => {

    const [dataLocal, setDataLocal] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect( () => {
        setIsLoading(true);
        try {
            const fetchTest = () => {
                db.find({}, async function (err, docs) {
                    if(err){
                        Alert.alert(err.message);
                    }
                    setDataLocal(docs[0].My_Cuadrilla.Empleados);
                    setIsLoading(false);
                });
            }

            fetchTest();
        } catch (error) {
            Alert.alert(error.message);
        }

        setIsLoading(false);
    },[db]);

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Tu Cuadrilla</Text>
            <View style={styles.button}>
                <TouchableOpacity style={{ backgroundColor: '#fff', padding: 7, borderRadius: 15 }} onPress={() => navigation.navigate('SignInScreen')}>
                    <MaterialIcons 
                        name="navigate-before"
                        color="#009387"
                        size={25}
                    />
                    <Text style={{ color: '#009387' }}>Volver</Text>
                </TouchableOpacity>
            </View>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView>
                {dataLocal.map(data => (
                    <View style={{ padding: 10, borderBottom: 2, borderBottomStyle: 'solid', borderBottomColor: '#cddcdcd', borderBottomWidth: 2 }} key={data.Codigo}>
                        <Text style={{ color:'#000' }}>Cedula: {data.Cedula}</Text>
                        <Text style={{ color:'#000' }}>Nombre: {data.Nombre}</Text>
                        <Text style={{ color:'#000' }}>Apellido: {data.Apellido}</Text>
                        <Text style={{ color:'#000' }}>Codigo: {data.Codigo}</Text>
                    </View>
                ))}

                {isLoading && <LoaderSpinner />}
                {dataLocal.length === 0 && (
                    <MessageAlert background='#F0615D' content='No se encontraron datos para mostrar.' />
                )}
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    button: {
        alignItems: 'flex-end',
    }
});
