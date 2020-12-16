import React, {createContext, useState} from 'react';

export const FechaContext = createContext();

const FechaProvider = ({children}) => {
  const [fechaCtx, setFechaCtx] = useState(new Date().toDateString());

  return (
    <FechaContext.Provider value={{fechaCtx, setFechaCtx}}>
      {children}
    </FechaContext.Provider>
  );
};

export default FechaProvider;
