const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: './config/.env' })
const os = require('os');
const jwt = require('jsonwebtoken')

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


//middleware to check if the user is authenticated
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //return a 401 error if theres no token
    if (token == null) {
        // console.log(authHeader);
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error(err);
            return res.sendStatus(403); 
        }
        req.user = user;
        console.log(`User ${user.userid} is authenticated`);
        next();
    });
}

//GET METHODS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

//gets a user from the username
app.get('/sql/get_user_from_username', authenticateToken, async (req, res) => {
    try {
        const { username } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        res.send(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the user' });
    }
});


//gets a trainer specified by trainer id
app.get('/sql/get_trainer_from_id', authenticateToken, async (req, res) => {
    try {
        const { trainerid } = req.body;
        const trainer = await pool.query('SELECT * FROM trainers WHERE trainerid = $1', [trainerid]);
        if (trainer.rows.length === 0) {
            return res.status(404).json({ message: 'No trainer found with specified id' });
        }
        return res.status(200).json(trainer.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the trainer' });
    }
    
});

//GET route to retrieve dashboard data
app.get('/sql/dashboard', authenticateToken, async (req, res) => {
    try {
        const { userid } = req.user;
        const dashboard = await pool.query('SELECT * FROM dashboard WHERE userid = $1;', [userid]);
        if (dashboard.rows.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }
        return res.status(200).json(dashboard.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the dashboard data' });
    }
});

app.get('/sql/userschedule', authenticateToken, async (req, res) => {
    try {
        const { userid } = req.user;
        const sessions = await pool.query('SELECT * FROM schedule WHERE userid = $1;', [userid]);
        if (sessions.rows.length === 0) {
            return res.status(404).json({ message: 'No userschedule under this userid' });
        }
        console.log(sessions.rows);
        return res.status(200).json(sessions.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the userschedule' });
    }
});

app.get('/sql/trainerschedule', authenticateToken, async (req, res) => {
    try {
        const { trainerid } = req.user;
        const sessions = await pool.query('SELECT * FROM schedule WHERE trainerid = $1;', [trainerid]);
        if (sessions.rows.length === 0) {
            return res.status(404).json({ message: 'No trainerschedule under this trainerid' });
        }
        console.log(sessions.rows);
        return res.status(200).json(sessions.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the trainerschedule' });
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
        //create a token for the user
        const token = jwt.sign({ userid: user.rows[0].userid }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // send the user id and the token back to the client
        res.status(200).json({ userid: user.rows[0].userid , token });
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