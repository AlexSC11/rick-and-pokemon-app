import { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig";

const FavoriteCharacters = ({ setUserData }) => {
    const [rickCharacters, setRickCharacters] = useState(null);
    const [pokemonCharacters, setPokemonCharacters] = useState(null);

    useEffect(() => {
        getFavoriteCharacters();
    },[]);

    const getFavoriteCharacters = async() => {
        try {
            const response = await axiosInstance.get('/favoritecharacters');
            setRickCharacters(response.data.rickData);
            setPokemonCharacters(response.data.pokemonData);
        } catch (error) {
            
        }
    };

    const handleDelete = async(id, type) => {
        try {
            await axiosInstance.put('/removecharacter',{ characterId: id, type});
            await getFavoriteCharacters();
        } catch (error) {
            
        }
    }

    const setAsProfilePhoto = async(imgSrc) => {
        try {
            const response = await axiosInstance.put('/updatephoto',{ profilePhoto: imgSrc });
            setUserData(response.data.userData);
        } catch (error) {
            
        }
    }

    const characterTable = (data, type) => {
        return(
            <table style={{ width: '100%'}}>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td><img src={item.image ? item.image : item.sprites.other['official-artwork'].front_default} alt={item.name} style={{ width: '50px', height: '50px'}}/></td>
                            <td>
                                <button onClick={ () => setAsProfilePhoto(item.image ? item.image : item.sprites.other['official-artwork'].front_default)} >Set as profile photo</button>
                                <button onClick={() => handleDelete(item.id, type)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    return (
        <>
            <h1>FavoriteCharacters</h1>
            <hr/>
            <h2>Rick and Morty</h2>
            { rickCharacters && characterTable(rickCharacters, 'rick') }
            <h2>Pokemon </h2>
            { pokemonCharacters && characterTable(pokemonCharacters, 'pokemon') }
        </>
    )
}

export default FavoriteCharacters;