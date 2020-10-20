import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
    TextInput,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import {useNetInfo} from "@react-native-community/netinfo";
import {NetworkInfo} from 'react-native-network-info';
import { getDomain, setDomain } from '../api/config';
import { LoaderSpinner } from '../components/loader/spiner-loader';
import { SetUsuario } from '../redux/model/usuarios';
import { Auth } from '../api/usuario';

const SplashScreen = ({navigation, UsuarioReducer, SetUsuario}) => {
    const { colors } = useTheme();
    const netInfo = useNetInfo();
    const [isLogind, setIsLogind] = useState(false);

    useEffect( () => {
        if(!netInfo.isConnected){
            Alert.alert('Necesitas conneccion a internet para bajar o subir datos.');
        }
    },[UsuarioReducer, netInfo]);

    const btn_empezar = async () => {
        setIsLogind(true);
        if(getDomain()){
            if(getDomain().indexOf('https') !== -1){
                try {
                    NetworkInfo.getIPAddress().then( async ip => {
                        const auth = await Auth(ip);
                        if(auth.data.feedback){
                            Alert.alert(auth.data.feedback);
                        }else{
                            SetUsuario(auth.data);
                            navigation.navigate('SignInScreen');
                        }
                    }).catch( err => Alert.alert(err.message));
                } catch (error) {
                    Alert.alert(error.message);
                }
            }else{
                Alert.alert('Inserta una URL valida.');
            }
        }else{
            Alert.alert('Inserta la URL de autorizacion.');
        }
        setIsLogind(false);
    }

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: 'bold' }}>Inserta la direccion autorizada</Text>
            <TextInput onChangeText={(value) => setDomain(value)} style={styles.input} type='url' placeholder='Inserta la URL autorizada'  />
        </View>
        <Animatable.View 
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
            animation="fadeInUpBig"
        >
            <Text style={[styles.title, {
                color: colors.text
            }]}>Cooperativa de produccion y comercializacion "La clementina"</Text>
            <Text style={styles.text}>Procede a iniciar session</Text>
            <View style={styles.button}>
                <TouchableOpacity onPress={btn_empezar}>
                    <LinearGradient
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.signIn}
                    >
                        <Text style={styles.textSign}>Empezar</Text>
                        <MaterialIcons 
                            name="navigate-next"
                            color="#fff"
                            size={20}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </Animatable.View>
        {isLogind && <LoaderSpinner />}
      </View>
    );
};

const mapStateToProps = ({ UsuarioReducer }) => {
    return { UsuarioReducer };
}

const mapDispatchToProp = {
    SetUsuario,
}

export default connect(mapStateToProps, mapDispatchToProp)(SplashScreen);


///// Styles ....


const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#009387'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  input: {
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 5,
    width: '80%',
    color: '#fff',
    marginTop: 15,
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 27,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});

