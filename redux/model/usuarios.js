
/// CONSTANTES

const initialData = {
    myUser:[],
    error: '',
    loading: true,
}

const GET_USUSARIOS = "GET_USUARIOS";

//// REDUCER

export default function reducer(state = initialData, action){
    switch(action.type){
        case GET_USUSARIOS:
            return { ...state, myUser: action.payload, loading: false }
        default:
            return state;
    }
}

///// ACTIONS

export const getUsuario = () => (dispatch) => {
    dispatch({
        type: GET_USUSARIOS,
        payload: [{ name: "andres", lasname: "coello" }]
    });
}
