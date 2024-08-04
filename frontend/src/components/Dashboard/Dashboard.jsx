import { useState } from "react";
import RandomCharacters from "./RandomCharacters";
import UserInfo from "./UserInfo";
import FavoriteCharacters from "./FavoriteCharacters";
import AllUsers from "./AllUsers";
import './Dashboard.css';

const Dashboard = ({ userData, setUserData, logout }) => {
    const [activeComponent, setActiveComponent] = useState('RandomCharacters');

    const renderComponent = () => {
        switch(activeComponent) {
            case 'RandomCharacters':
                return <RandomCharacters setUserData={ setUserData }/>;
            case 'UserInfo':
                return <UserInfo userData={ userData } setUserData={ setUserData } logout={ logout }/>;
            case 'FavoriteCharacters':
                return <FavoriteCharacters setUserData={ setUserData }/>
            case 'AllUsers':
                return <AllUsers/>
            default:
                return null;
        }
    }

    return (
        <div className="dashboard-container">
            <div className="button-container">
                <button onClick={ () => setActiveComponent('RandomCharacters')}>Show Random Characters</button>
                <button onClick={ () => setActiveComponent('UserInfo')}>User Info</button>
                <button onClick={ () => setActiveComponent('FavoriteCharacters')}>Show Favorite Characters</button>
                <button onClick={ () => setActiveComponent('AllUsers')}>Show All Users</button>
                <button onClick={ logout }>Log out</button>
            </div>
            { renderComponent() }
        </div>
    )
}

export default Dashboard;
