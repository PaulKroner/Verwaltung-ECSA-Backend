require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.DB_PG_USER,
  password: process.env.DB_PG_PASSWORD,
  host: process.env.DB_PG_HOST,
  port: process.env.DB_PG_PORT,
  database: process.env.DB_PG_NAME
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};