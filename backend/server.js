require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const characterRoutes = require('./routes/characterRoutes');
const cookieParser = require('cookie-parser');

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true 
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/', userRoutes);
app.use('/', characterRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
