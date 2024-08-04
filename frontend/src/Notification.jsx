import React from 'react';
import { useNotification } from './NotificationContext';

const Notification = () => {
    const { notification } = useNotification();

    return (
        notification.message && (
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: notification.color,
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                zIndex: 1000,
            }}>
                {notification.message}
            </div>
        )
    );
};

export default Notification;
