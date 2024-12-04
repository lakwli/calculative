import React, { createContext, useContext, useState } from 'react';
import Simul from '../models/Simul';

const SimulContext = createContext();

export const SimulProvider = ({ children }) => {
  const [simul, setSimul] = useState(new Simul());

  return (
    <SimulContext.Provider value={{ simul, setSimul }}>
      {children}
    </SimulContext.Provider>
  );
};

export const useSimul = () => useContext(SimulContext);
