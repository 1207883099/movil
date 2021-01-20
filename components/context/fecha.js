import React, {createContext, useState} from 'react';
import {getDia} from '../../hooks/fechas';

export const FechaContext = createContext();

const FechaProvider = ({children}) => {
  const [fechaCtx, setFechaCtx] = useState(getDia(new Date()));

  return (
    <FechaContext.Provider value={{fechaCtx, setFechaCtx}}>
      {children}
    </FechaContext.Provider>
  );
};

export default FechaProvider;
