import React, { createContext, useState } from 'react';

export const SolicitudContext = createContext();

export const SolicitudProvider = ({ children }) => {
    const [solicitudes, setSolicitudes] = useState([]);

    return (
        <SolicitudContext.Provider value={{ solicitudes, setSolicitudes }}>
            {children}
        </SolicitudContext.Provider>
    );
};
