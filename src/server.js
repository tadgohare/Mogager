const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: './config/.env' })
const os = require('os');

const interfaces = os.networkInterfaces();

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
        //check if supplied username and password are not empty
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const user = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        //check if there exists a user with the username and password specified
        if(user.rows.length === 0){ return res.status(400).json({ error: 'User does not exist' }); }
        // send the user id back to the client
        res.status(200).json({ userid: user.rows[0].userid });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while logging in on our side' });
    }
});

let ip = '0.0.0.0'; // open to listening no matter what

for (let interfaceName in interfaces) {
    const interface = interfaces[interfaceName];
    for (let alias of interface) {
        if ('IPv4' === alias.family && alias.internal === false) {
            // Found a non-internal IPv4 address
            ip = alias.address;
            break;
        }
    }
}

const port = process.env.PORT || 3000;


app.listen(port, ip, () => {
    console.log(`Server is running on http://${ip}:${port}`);
});