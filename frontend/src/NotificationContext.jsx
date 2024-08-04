import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ message: null, color: 'red'});

    const showNotification = (message, color = 'red') => {
        setNotification({ message, color });
        setTimeout(() => {
            setNotification({ message: null, color: 'red'});
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};
