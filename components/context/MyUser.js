import React, {createContext, useState} from 'react';

export const MyUserContext = createContext();

const MyUserProvider = ({children}) => {
  const [UserCtx, setUserCtx] = useState({
    token: undefined,
    id_Empleado: undefined,
    id_login_movil: undefined,
    fecha_ingreso: undefined,
    movil_ip: undefined,
    Nombre: undefined,
    Apellido: undefined,
    IdMayordomo: undefined,
  });

  return (
    <MyUserContext.Provider value={{UserCtx, setUserCtx}}>
      {children}
    </MyUserContext.Provider>
  );
};

export default MyUserProvider;
