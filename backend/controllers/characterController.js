const { default: axios } = require('axios');
const pool = require('../config');

const getRamdomCharacters = async(req, res) => {
    try {
        const randomRickandmortyId = Math.floor(Math.random() * 826 ) + 1;
        const rickandmortyCharacter = await axios.get(`https://rickandmortyapi.com/api/character/${randomRickandmortyId}`);

        const randomPokenId = Math.floor(Math.random() * 1025) + 1;
        const pokemonCharacter = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokenId}`);

        res.status(200).json({rickandmortyCharacter: rickandmortyCharacter.data, pokemonCharacter: pokemonCharacter.data});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getFavoriteCharacters = async(req, res) => {
    try {
        const { email } = req.user;
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if( rows.length === 0){
            return res.status(404).json({ error: 'User not found'});
        }
        const userData = rows[0];

        const pokemonPromises = userData.pokemonfavorites.map(id => 
            axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        );
        const pokemonResponses = await Promise.all(pokemonPromises);
        const pokemonData = pokemonResponses.map(response => response.data);

        const rickPromises = userData.rickfavorites.map(id => 
            axios.get(`https://rickandmortyapi.com/api/character/${id}`)
        );
        const rickResponses = await Promise.all(rickPromises);
        const rickData = rickResponses.map(response => response.data);

        res.status(200).json({ pokemonData, rickData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addNewFavoriteCharacter = async(req, res) => {
    try {
        const { email } = req.user;
        const { characterId, type } = req.body;
        
        const values = [characterId, email];
        if(type === 'rick'){
            const query = `
                UPDATE users
                SET rickfavorites = array_append(rickfavorites, $1)
                WHERE email = $2 AND NOT $1 = ANY(rickfavorites);
            `;
            await pool.query(query, values);
        }else {
            const query = `
                UPDATE users
                SET pokemonfavorites = array_append(pokemonfavorites, $1)
                WHERE email = $2 AND NOT $1 = ANY(pokemonfavorites);
            `;
            await pool.query(query, values);
        }
        res.status(200).json({ message: 'favorite character added'});

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const removeFavoriteCharacter = async(req, res) => {
    try {
        const { email } = req.user;
        const { characterId, type } = req.body;
        
        const values = [characterId, email];
        if(type === 'rick'){
            const query = `
                UPDATE users
                SET rickFavorites = array_remove(rickFavorites, $1)
                WHERE email = $2;
            `;
            await pool.query(query, values);
        }else {
            const query = `
                UPDATE users
                SET pokemonFavorites = array_remove(pokemonFavorites, $1)
                WHERE email = $2;
            `;
            await pool.query(query, values);
        }
        res.status(200).json({ message: 'Character removed'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getRamdomCharacters, 
    getFavoriteCharacters,
    addNewFavoriteCharacter,
    removeFavoriteCharacter,
}
