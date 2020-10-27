import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';
import { LoaderSpinner } from '../components/loader/spiner-loader';
import { connect } from 'react-redux';
import { insertar, db } from '../db-local/config-db-local';
import LinearGradient from 'react-native-linear-gradient';
import { obtenerMaestra } from '../api/maestra';
import { SemanaDelAno } from '../components/pequenos/semana-del-ano';

const SignInScreen = ({navigation, UsuarioReducer}) => {

    const [dataLocal, setDataLocal] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReload, setIsReload] = useState(false);

    useEffect( () => {
        try {
            const fetchTest = () => {
                db.find({}, async function (err, docs) {
                    if(err){
                        Alert.alert(err.message);
                    }
                    setDataLocal(docs);
                });
            }

            if(isReload){
                setIsReload(false);
            }

            fetchTest();
        } catch (error) {
            Alert.alert(error.message);
        }
    },[db, isReload]);

    const bajar_maestra = async () => {
        setIsLoading(true);
        try {
            const maestra = await obtenerMaestra(UsuarioReducer.MyUser[0].token);
            if(maestra.data.My_Cuadrilla != undefined){
                insertar([maestra.data]);
                Alert.alert('Se Obtuvo datos Maestra :)');
                setIsLoading(false);
                setIsReload(true);
            }else{
                Alert.alert('Datos vacios de la maestra :(');
            }
        } catch (error) {
            Alert.alert(error.message);
        }
        setIsLoading(false);
    }

    const eliminar_datos = () => {
        db.remove({}, { multi: true }, function (err, numRemoved) {
            if(err){
                Alert.alert(err.message);
            }
            setIsReload(true);
            Alert.alert(`Se eliminaron ${numRemoved} registros guardados.`);
            navigation.navigate('SplashScreen');
        });
    }

    return (
        <>
            <View style={{ padding: 10, backgroundColor: '#cdcdcd' }}>
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Mis Datos</Text>
                <Text>Ip Movil: <Text style={{ fontWeight: 'bold' }}>{UsuarioReducer.MyUser[0].movil_ip === undefined ? 'Indefinido' : UsuarioReducer.MyUser[0].movil_ip}</Text></Text>
                <Text>Ingreso el: <Text style={{ fontWeight: 'bold' }}>{UsuarioReducer.MyUser[0].fecha_ingreso === undefined ? 'Indefinido' : UsuarioReducer.MyUser[0].fecha_ingreso}</Text></Text>
                <Text>Nombres: <Text style={{ fontWeight: 'bold' }}>{UsuarioReducer.MyUser[0].Nombre === undefined ? 'Indefinido' : UsuarioReducer.MyUser[0].Nombre}</Text></Text>
                <Text>Apellidos: <Text style={{ fontWeight: 'bold' }}>{UsuarioReducer.MyUser[0].Apellido === undefined ? 'Indefinido' : UsuarioReducer.MyUser[0].Apellido}</Text></Text>
            </View>
            <SemanaDelAno />
            <View style={styles.button}>
                <ScrollView>
                    {dataLocal.length > 0 ? (
                        <>
                            <TouchableOpacity
                                style={styles.delete}
                                onPress={eliminar_datos}
                            >
                                <LinearGradient
                                    colors={['#EB9058', '#EB5443']}
                                    style={styles.signIn}
                                >
                                    <Text style={[styles.textSign, {
                                        color:'#fff'
                                    }]}>Eliminar Datos</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.delete}
                                onPress={() => navigation.navigate('SignUpScreen', {test: 'probando'})}
                            >
                                <LinearGradient
                                    colors={['#5982EB', '#A69649']}
                                    style={styles.signIn}
                                >
                                    <Text style={[styles.textSign, {
                                        color:'#fff'
                                    }]}>Ver Mis Cuadrilla</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.delete}
                                onPress={() => navigation.navigate('ParteDiario')}
                            >
                                <LinearGradient
                                    colors={['#69ABC9', '#69D6C9']}
                                    style={styles.signIn}
                                >
                                    <Text style={[styles.textSign, {
                                        color:'#fff'
                                    }]}>Gestionar Parte Diario</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={{ padding: 10, borderBottom: 2, borderBottomColor: '#cdcdcd', borderBottomWidth: 2, marginBottom: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Estas opciones son mostradas por que se detectaron datos guardados.</Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.signIn}
                                onPress={bajar_maestra}
                            >
                                <LinearGradient
                                    colors={['#08d3c4', '#06ab9d']}
                                    style={styles.signIn}
                                >
                                    <Text style={[styles.textSign, {
                                        color:'#fff'
                                    }]}>Bajar Maestra</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {isLoading && <LoaderSpinner />}
                        </>
                    )}

                    {dataLocal.length > 0 && UsuarioReducer.MyUser[0].movil_ip !== undefined ? (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignUpScreen')}
                            style={[styles.signIn, {
                                borderColor: '#009387',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#009387'
                            }]}>Subir datos</Text>
                        </TouchableOpacity>
                    ) : ( dataLocal.length > 0 &&
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SplashScreen', {login: true})}
                            style={[styles.signIn, {
                                borderColor: '#009387',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#009387'
                            }]}>Volver ah iniciar session</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        </>
    )
};

const mapStateToProps = ({ UsuarioReducer }) => {
    return { UsuarioReducer };
}

export default connect(mapStateToProps, null)(SignInScreen);

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
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    button: {
        alignItems: 'center',
        marginTop: 70
    },
    signIn: {
        width: '100%',
        height: 50,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    delete: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
