import axiosInstance from "../../../axiosConfig";
import { useNotification } from "../../NotificationContext";

const CharacterCard = ({imgSrc, name, id, type ,setUserData }) => {

    const { showNotification } = useNotification();

    const addToFavorites = async() => {
        try {
            await axiosInstance.put('/addcharacter',{ characterId: id, type });
            showNotification('Character added to favorites', 'green');
        } catch (error) {
            showNotification(error.response.data.error);
        }
    };

    const setAsProfilePhoto = async() => {
        try {
            const response = await axiosInstance.put('/updatephoto',{ profilePhoto: imgSrc });
            setUserData(response.data.userData);
            showNotification('Profile photo updated', 'green');
        } catch (error) {
            showNotification(error.response.data.error);
        }
    }

    return (
        <div style={{display: "grid", gap: '10px', margin: '10px'}}>
            <img src={ imgSrc } style={{ height: '300px', width: '300px'}}/>
            <div> Id: { id }</div>
            <div> Name: { name }</div>
            <button onClick={ addToFavorites }>Add to favorites</button>
            <button onClick={ setAsProfilePhoto }>Set as profile photo</button>
        </div>
    )
}

export default CharacterCard;
