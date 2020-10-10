import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

export const db = new Datastore({
    filename: 'asyncStorageKey',
    storage: AsyncStorage,
    autoload: true,
});

export function insertar(data){

    db.insert(data, function (err, newDoc) {
        if(err){
            console.log(err);
        }
        console.log('SE INSERTO UN NUEVO VALOR ' + newDoc);
    });
}

export function consultar(){
    db.find({}, function (err, docs) {
        if(err){
            console.log(err);
        }
        return docs;
    });
}
