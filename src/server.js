const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: './config/.env' })
const os = require('os');
const jwt = require('jsonwebtoken');
const { time } = require('console');

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
        console.log('Token is null');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error(err);
            console.log('Token is invalid');
            return res.sendStatus(403); 
        }
        if (user.userid) {
            console.log(`User ${user.userid} is authenticated`);
        } else if (user.adminid) {
            console.log(`Admin ${user.adminid} is authenticated`);
        } else if (user.trainerid) {
            console.log(`Trainer ${user.trainerid} is authenticated`);
        } else {
            return res.sendStatus(401);
        }
        req.user = user;
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

app.get('/sql/get_rooms', authenticateToken, async (req, res) => {
    try {
        const rooms = await pool.query('SELECT * FROM rooms');
        if (rooms.rows.length === 0) {
            return res.status(404).json({ message: 'No rooms found' });
        }
        return res.status(200).json(rooms.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the rooms' });
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
        // console.log(sessions.rows);
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
        // console.log(sessions.rows);
        return res.status(200).json(sessions.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the trainerschedule' });
    }
});

app.get('/sql/getequipment', authenticateToken, async (req, res) => {
    try {
        const equipment = await pool.query('SELECT * FROM equipment_view');
        if (equipment.rows.length === 0) {
            return res.status(404).json({ message: 'No equipment found' });
        }
        return res.status(200).json(equipment.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the equipment' });
    }
});

app.get('/sql/trainer_schedule', authenticateToken, async (req, res) => {
    try {
        const { trainerid } = req.user;
        const schedule = await pool.query('SELECT * FROM schedule WHERE trainerid = $1', [trainerid]);
        if (schedule.rows.length === 0) {
            return res.status(404).json({ message: 'No schedule found' });
        }
        return res.status(200).json(schedule.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting the schedule' });
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

app.post('/sql/insert_trainer', async (req, res) => {
    try {
        const { username, password, name} = req.body;
        await pool.query('INSERT INTO trainers(username, password, name) VALUES($1, $2, $3)', [username, password, name]);
        res.status(200).json({ message: 'Trainer inserted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while inserting the trainer' });
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

//admin login function
app.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        //check if supplied username and password are not empty
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const admin = await pool.query('SELECT * FROM admins WHERE username = $1 AND password = $2', [username, password]);
        //check if there exists a user with the username and password specified
        if(admin.rows.length === 0){ return res.status(400).json({ error: 'Admin does not exist' }); }
        //create a token for the user
        const token = jwt.sign({ adminid: admin.rows[0].adminid }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // send the user id and the token back to the client
        res.status(200).json({ adminid: admin.rows[0].adminid , token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while logging in on our side' });
    }
});

//trainer login function
app.post('/trainer/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        //check if supplied username and password are not empty
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const trainer = await pool.query('SELECT * FROM trainers WHERE username = $1 AND password = $2', [username, password]);
        //check if there exists a user with the username and password specified
        if(trainer.rows.length === 0){ return res.status(400).json({ error: 'Trainer does not exist' }); }
        //create a token for the user
        const token = jwt.sign({ trainerid: trainer.rows[0].trainerid }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // send the user id and the token back to the client
        res.status(200).json({ trainerid: trainer.rows[0].trainerid , token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while logging in on our side' });
    }
});

//function for adding a new piece of equipment to the database
app.post('/sql/add_equipment', authenticateToken, async (req, res) => {
    try {
        const { name, roomid } = req.body;

        await pool.query('INSERT INTO equipment(name, roomid, needs_repair) VALUES($1, $2, false)', [name, roomid]);
        res.status(200).json({ message: 'Equipment added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the equipment' });
    }
});

app.post('/sql/add_room', authenticateToken, async (req, res) => {
    try {
        const { name, is_bookable } = req.body;
        console.log(`Attempting to add room: ${name}`);
        await pool.query('INSERT INTO rooms(name, is_bookable) VALUES($1, $2)', [name, is_bookable]);
        res.status(200).json({ message: 'Room added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the room' });
    }
});

//function for adding a new session to the schedule
app.post('/sql/add_session', authenticateToken, async (req, res) => {
    try {
        const { userid, trainer, timestamp } = req.body;
        const trainerid = await pool.query('SELECT trainerid FROM trainers WHERE name = $1', [trainer]);
        await pool.query('INSERT INTO sessions(userid, trainerid, start_time) VALUES($1, $2, $3)', [userid, trainerid.rows[0].trainerid, timestamp]);
        res.status(200).json({ message: 'Session added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the session' });
    }
});

//PUT METHODS
//updates the height weight, and email of the user
app.put('/sql/update_user', authenticateToken, async (req, res) => {
    try{
        const { userid, height, weight, username, healthid} = req.body;
        const updateHealthQuery = `
            UPDATE health
            SET height = $1, weight = $2
            WHERE healthid = $3;
        `;
        await pool.query(updateHealthQuery, [height, weight, healthid]);
        const updateUserQuery = `
            UPDATE users
            SET username = $1
            WHERE userid = $2;
        `;
        await pool.query(updateUserQuery, [username, userid]);

        res.status(200).json({ message: 'User updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the user' });
    }
});

//updates the repair status of a piece of equipment
app.put('/sql/repair_equipment', authenticateToken, async (req, res) => {
    try {
        const { asset_tag, needs_repair } = req.body;
        await pool.query('UPDATE equipment SET needs_repair = $1 WHERE asset_tag = $2', [needs_repair, asset_tag]);
        res.status(200).json({ message: 'Equipment updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the equipment' });
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