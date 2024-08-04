const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../authenticators/tokenAuthenticaros');

router.get('/users', authenticateToken,  userController.getUsers);
router.get('/user', authenticateToken, userController.getUserByEmail);
router.put('/user', authenticateToken, userController.updateUser);
router.put('/updatephoto', authenticateToken, userController.updateProfilePhoto);
router.delete('/user', authenticateToken, userController.deleteUser);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
