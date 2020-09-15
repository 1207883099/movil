import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import UsuarioReducer, { getUsuario } from './model/usuarios';
import { composeWithDevTools } from "remote-redux-devtools";
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    UsuarioReducer,
});


const composeEnhancers = (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) || compose;

export default function generateStore(){
    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

    getUsuario()(store.dispatch);
    return store;
}
