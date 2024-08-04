import axiosInstance from "../../../axiosConfig";

const CharacterCard = ({imgSrc, name, id, type ,setUserData }) => {

    const addToFavorites = async() => {
        try {
            await axiosInstance.put('/addcharacter',{ characterId: id, type });
        } catch (error) {
            console.log(error);
        }
    };

    const setAsProfilePhoto = async() => {
        try {
            const response = await axiosInstance.put('/updatephoto',{ profilePhoto: imgSrc });
            setUserData(response.data.userData);
        } catch (error) {
            
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
