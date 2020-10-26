import React, { useState, useEffect } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from "react-native";
import { insertar, db } from '../db-local/config-db-local';

const ParteDiarioScreen = () => {

    useEffect( () => {
        try {
            const fetchTest = () => {
                db.find({}, async function (err, docs) {
                    if(err){
                        Alert.alert(err.message);
                    }
                    console.log(docs[1]);
                });
            }
            const ParteDiario = {
                tipo: 'cultivo',
                labores: [{
                    labor: 'uno',
                    Asignado: [{
                        Empleado: 'ninguno'
                    }]
                }]
            }

            const Mis_Parte_Diario = [];
            MisParteDiario.push(ParteDiario);

            //insertar([{Mis_Parte_Diario}]);
            fetchTest();
        } catch (error) {
            Alert.alert(error.message);
        }
    },[db]);

    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={styles.centeredView}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            }}
        >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Hello World!</Text>

                <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                    setModalVisible(!modalVisible);
                }}
                >
                <Text style={styles.textStyle}>Hide Modal</Text>
                </TouchableHighlight>
            </View>
            </View>
        </Modal>

        <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
            setModalVisible(true);
            }}
        >
            <Text style={styles.textStyle}>Show Modal</Text>
        </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      width: '90%',
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });

export default ParteDiarioScreen;