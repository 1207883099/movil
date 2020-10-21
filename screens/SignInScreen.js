import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { insertar, db } from '../db-local/config-db-local';
import LinearGradient from 'react-native-linear-gradient';

const SignInScreen = ({navigation, UsuarioReducer}) => {

    const [dataLocal, setDataLocal] = useState([]);

    useEffect( () => {
        console.log(UsuarioReducer.MyUser);
        try {
            const fetchTest = () => {
                db.find({}, async function (err, docs) {
                    if(err){
                        Alert.alert(err.message);
                    }
                    setDataLocal(docs);
                });
            }

            fetchTest();
        } catch (error) {
            Alert.alert(error.message);
        }
    },[UsuarioReducer]);

    const eliminar_datos = () => {
        db.remove({}, { multi: true }, function (err, numRemoved) {
            if(err){
                Alert.alert(err.message);
            }
            Alert.alert(`Se eliminaron ${numRemoved} registros guardados.`);
        });
    }

    return (
        <>
            <View style={{ padding: 10, backgroundColor: '#cdcdcd' }}>
                <Text>Ip Usuario: <Text style={{ fontWeight: 'bold' }}>{UsuarioReducer.MyUser.movil_ip === undefined ? 'Indefinido' : UsuarioReducer.MyUser.movil_ip}</Text></Text>
                <Text>Ingreso el: <Text style={{ fontWeight: 'bold' }}>{UsuarioReducer.MyUser.fecha_ingreso === undefined ? 'Indefinido' : UsuarioReducer.MyUser.fecha_ingreso}</Text></Text>
            </View>
            <View style={styles.button}>
                <ScrollView>
                    {dataLocal.length === 0 && (
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
                                    }]}>ELiminar Datos</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.delete}
                                onPress={() => navigation.navigate('SignUpScreen')}
                            >
                                <LinearGradient
                                    colors={['#5982EB', '#6491EB']}
                                    style={styles.signIn}
                                >
                                    <Text style={[styles.textSign, {
                                        color:'#fff'
                                    }]}>Ver Mi Cuadrilla</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={{ padding: 10, borderBottom: 2, borderBottomColor: '#cdcdcd', borderBottomWidth: 2, marginBottom: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Estas opciones son mostradas por que se detectaron datos guardados.</Text>
                            </View>
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => false}
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
        marginTop: 150
    },
    signIn: {
        width: '90%',
        height: 50,
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
