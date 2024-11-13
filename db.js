require('dotenv').config();
const mysql = require('mysql2');


const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  // connectTimeout: 20000, // 20 seconds
});

module.exports = {
  query: (text, params) => {
    return new Promise((resolve, reject) => {
      pool.query(text, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  // query: (text, params) => pool.query(text, params)
};