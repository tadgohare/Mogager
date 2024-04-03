import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

const createUser = async (username, password, name) => {
    const query = {
        text: 'INSERT INTO users(username, password, name) VALUES($1, $2, $3)',
        values: [username, password, name],
    };
    try {
        const res = await pool.query(query);
        console.log(res.rows[0]);
    } catch (err) {
        console.error(err.stack);
    }
};

const getUser = async (username) => {
    const query = {
        text: 'SELECT * FROM users WHERE username = $1',
        values: [username],
    };
    try {
        const res = await pool.query(query);
        console.log(res.rows[0]);
    } catch (err) {
        console.error(err.stack);
    }
};

// Export the functions and make sure to add more as needed.
module.exports = {
    createUser,
    getUser
}