
/// CONSTANTES

export const initialData = {
    MyUser: [{
        token: undefined,
        id_Empleado: undefined,
        id_login_movil: undefined,
        fecha_ingreso: undefined,
        movil_ip: undefined,
    }],
    error: '',
    loading: false,
}

const SET_MY_USER = "SET_MY_USER";

//// REDUCER

export default function reducer(state = initialData, action){
    switch(action.type){
        case SET_MY_USER:
            return { ...state, MyUser: action.payload, loading: false }
        default:
            return state;
    }
}

///// ACTIONS

export const SetUsuario = (myUser) => (dispatch) => {
    dispatch({
        type: SET_MY_USER,
        payload: myUser
    });
}
