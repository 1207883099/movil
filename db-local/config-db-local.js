import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

const db = new Datastore({
    filename: 'asyncStorageKey',
    storage: AsyncStorage,
    autoload: true,
});

export function insertar(){
    var doc = { 
        hello: 'world',
        n: 5,
        today: new Date(),
        react_native_local_mongodbIsAwesome: true,
        notthere: null,
        notToBeSaved: undefined,
        fruits: [ 'apple', 'orange', 'pear' ],
        infos: { name: 'react-native-local-mongodb' }
    };
    
    db.insert(doc, function (err, newDoc) {
        if(err){
            console.log(err);
        }
        console.log(newDoc);
    });
}

export function consultar(){
    db.find({ n: 5 }, function (err, docs) {
        if(err){
            console.log(err);
        }
        console.log(docs);
        return docs;
    });
}
