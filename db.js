const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'employees_test'
});

// pool.connect();

// pool.query(`Select * from pgtest`, (err, res) => {
//   if(err) {
//     console.log(err);
//   }
//   else {
//     console.log(res.rows);
//   }
// });

module.exports = {
  query: (text, params) => pool.query(text, params)
};