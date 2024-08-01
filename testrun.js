const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

//main.js
// const controller = require('./controllers/controller');
// const { getExample } = controller;
// const queries = require('./queries/queries');
// app.get('/api/example', getExample);

//db.js
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432, // default Postgres port
    database: 'employees_test'
});

// queries.js
// const tableName = 'pgtest';
// const getExampleData = async () => {
//     try {
//         const result = await pool.query('SELECT * FROM pgtest');
//         return result.rows;
//     } catch (error) {
//         throw new Error('Error executing query');
//     }
// };

// Importiere getExampleData aus queries.js
const { getExampleData } = require('./queries/queries');


const testfunction = async () => {
    try {
        const data = await getExampleData();
        console.log('Data from database:', data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    } finally {
        process.exit(); // Exit the process after execution
    }
};


// const testfunction = async () => {
//     try {
//       const data = await getExample();
//       console.log('Data from database:', data);
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//     } finally {
//       process.exit(); // Beende den Prozess nach der Ausführung
//     }

//     // pool.query(`Select * from pgtest`, (err, res) => {
//     //   if(err) {
//     //     console.log(err);
//     //   }
//     //   else {
//     //     console.log(res.rows);
//     //   }
//     // });


//   };

testfunction();
