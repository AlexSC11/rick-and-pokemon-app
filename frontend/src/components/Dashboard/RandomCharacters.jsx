import { useEffect, useState } from "react";
import CharacterCard from "./CharacterCard";
import axiosInstance from "../../../axiosConfig";
import { useNotification } from "../../NotificationContext";

const RandomCharacters = ({ setUserData }) => {
    const [rickCharacter, setRickCharacter] = useState(null);
    const [pokemonCharacter, setPokemonCharacter] = useState(null);
    
    useEffect(() => {
        getRandomCharacters();
    },[]);

    const { showNotification } = useNotification();

    const getRandomCharacters = async() => {
        try {
            const response = await axiosInstance.get('/characters');
            setPokemonCharacter(response.data.pokemonCharacter);
            setRickCharacter(response.data.rickandmortyCharacter);
        } catch (error) {
            showNotification(error.response.data.error);
        }
    };

    return (
        <>
            <h1>Random Characters</h1>
            <hr/>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                { rickCharacter && <CharacterCard 
                    imgSrc={ rickCharacter.image } 
                    name={ rickCharacter.name} 
                    id={ rickCharacter.id }
                    type='rick'
                    setUserData={ setUserData }
                />}
                { pokemonCharacter && <CharacterCard 
                    imgSrc={ pokemonCharacter.sprites.other['official-artwork'].front_default } 
                    name={ pokemonCharacter.name} 
                    id={ pokemonCharacter.id } 
                    type='pokemon'
                    setUserData={ setUserData }
                />}
            </div>
            <button onClick={ getRandomCharacters }>Reload characters</button>
        </>
    )
}

export default RandomCharacters;