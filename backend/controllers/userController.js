require('dotenv').config();
const pool = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT name, profilephoto, id FROM users');
        res.status(200).json({ usersData: result.rows});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserByEmail = async(req, res) => {
    try {
        const { email } = req.user;
        const { rows } = await pool.query('SELECT name, email, profilephoto FROM users WHERE email = $1', [email]);
        if( rows.length === 0 ){
            return res.status(404).json({ error: 'User not found'});
        }
        const userData = rows[0];
        res.status(200).json({ userData, isValidToken: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
}

const updateUser = async(req, res) => {
    try {
        const { name, password } = req.body;
        const { email } = req.user;
        const { rowCount } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(rowCount === 0){
            return res.status(404).json({ error: 'User not found'});
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const updateQuery = `
            UPDATE users
            SET name = $1, password = COALESCE($2, password)
            WHERE email = $3
        `;
        const updateValues = [name, hashedPassword, email];

        await pool.query(updateQuery, updateValues);
        const userData = { name, email }
        res.status(200).json({ message: 'User updated successfully', userData});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
}

const updateProfilePhoto = async(req, res) => {
    try {
        const { profilePhoto } = req.body;
        const { email } = req.user;
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(rows.length === 0){
            return res.status(404).json({ error: 'User not found'});
        }

        const name = rows[0].name;

        const updateQuery = `
            UPDATE users
            SET profilephoto = $1
            WHERE email = $2
        `;
        const updateValues = [ profilePhoto, email];
        await pool.query(updateQuery, updateValues);
        const userData = { profilephoto: profilePhoto, email, name }
        res.status(200).json({ message: 'User profile photo updated successfully', userData});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
}

const deleteUser = async(req, res) => {
    try {
        const { email } = req.user;
        await pool.query('DELETE FROM users WHERE email = $1', [email]);
        res.status(200).json({ message: 'User deleted'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
}

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { rowCount } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rowCount > 0) {
            return res.status(400).json({ error: 'Email already exist' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, hashedPassword]
        );

        const token = jwt.sign({ name, email }, process.env.SECRET_KEY, { expiresIn: '12h' });

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length < 1) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ name: user.name, email }, process.env.SECRET_KEY, { expiresIn: '12h' });
        const userData = {
            name: user.name,
            email: user.email,
            profilephoto: user.profilephoto,
        }
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(201).json({ message: 'User login successfully', userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getUsers,
    getUserByEmail,
    updateUser,
    deleteUser,
    updateProfilePhoto,
    signup,
    login,
    logout,
};
