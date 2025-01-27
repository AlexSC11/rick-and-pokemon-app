import { useState } from "react";
import axiosInstance from "../../../axiosConfig";
import { useNotification } from "../../NotificationContext";

const UserInfo = ({userData, setUserData, logout }) => {
    const [name, setName] = useState(userData.name);
    const [password, setPassword] = useState('');

    const { showNotification } = useNotification();

    const onSaveChanges = async() => {
        try {
            const response = await axiosInstance.put('/user',{ name, password });
            const { userData } = response.data;
            setUserData(userData)
            showNotification('User info updated', 'green');
        } catch (error) {
            showNotification(error.response.data.error);
        }
    }

    const onCancelChages = () => {
        setName(userData.name);
        setPassword('');
    }

    const onDeleteUser = async() => {
        try {
            await axiosInstance.delete('/user');
            logout();
        } catch (error) {
            
        }
    }

    return (
        <div>
            <h1>User Info</h1>
            <hr/>
            <div style={{ display: 'inline-grid', gap: '10px'}}>
                {
                    userData.profilephoto && <img src={ userData.profilephoto } style={{ height: '300px', width: '300px'}}/>
                }
                <input
                    value={ name }
                    onChange={ (e) => setName(e.target.value) }
                />
                <input
                    value={ password }
                    placeholder="Enter new password"
                    type="password"
                    onChange={ (e) => setPassword(e.target.value) }
                />
                <button onClick={ onSaveChanges }>Save</button>
                <button onClick={ onCancelChages }>Cancel</button>
                <button onClick={ onDeleteUser } style={{ backgroundColor: 'red' }}>Delete user</button>
            </div>
        </div>
    )
}

export default UserInfo;
