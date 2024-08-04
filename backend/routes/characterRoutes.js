const express = require('express');
const router = express.Router();
const { getRamdomCharacters, addNewFavoriteCharacter, removeFavoriteCharacter, getFavoriteCharacters } = require('../controllers/characterController');
const authenticateToken = require('../authenticators/tokenAuthenticaros');


router.get('/characters', authenticateToken ,getRamdomCharacters);
router.get('/favoritecharacters', authenticateToken, getFavoriteCharacters);
router.put('/addcharacter', authenticateToken, addNewFavoriteCharacter);
router.put('/removecharacter', authenticateToken, removeFavoriteCharacter);

module.exports = router;
