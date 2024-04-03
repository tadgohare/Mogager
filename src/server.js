const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// console.log(pool);

//GET METHODS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/sql/get_user', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        res.send(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the user' });
    }
});

//POST METHODS
app.post('/sql/insert_user', async (req, res) => {
    try {
        const { username, password, name, weight, height, gender, age } = req.body;
        const healthResult = await pool.query('INSERT INTO health(weight, height, gender, age) VALUES($1, $2, $3, $4) RETURNING healthid', [weight, height, gender, age]);    
        // console.log(healthResult.rows[0]);
        const healthID = healthResult.rows[0].healthid;
        await pool.query('INSERT INTO users(username, password, name, healthid) VALUES($1, $2, $3, $4)', [username, password, name, healthID]);
        res.send({ message: 'User inserted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while inserting the user' });
    }
});

//login method for user
app.post('/user/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        res.send(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while logging in' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});