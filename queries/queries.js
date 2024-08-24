/**
 * This file contains all the queries that will be used to interact with the database.
 * The queries are exported and used in the controller functions.
 */
const pool = require('../db');
const tableName = 'employees_new';

// get * query for the overview-table
const getDatafromDBQuery = async () => {
    try {
        const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY name;`);
        return result.rows;
    } catch (err) {
        throw new Error('Error fetching data from database');

    }
};

// insert new employee
const insertNewEmployeeQuery = async (data) => {
  try {
      // Extract keys and values from the data object
      const keys = Object.keys(data);
      const values = Object.values(data);

      // Build the columns part of the query
      const columns = keys.join(', ');

      // Create placeholders for values in the SQL query
      const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

      // Construct the SQL query
      const query = `
          INSERT INTO ${tableName} (${columns})
          VALUES (${placeholders})
          RETURNING *;
      `;

      // Execute the query
      const result = await pool.query(query, values);
      
      return result.rows[0];
  } catch (err) {
      throw new Error('Error inserting data into the database');
  }
};

// update an employee
const updateEmployeeQuery = async (data) => {
    try {
        const query = `
            UPDATE ${tableName}
            SET name = $2, vorname = $3, email = $4, postadresse = $5, fz_eingetragen = $6, fz_abgelaufen = $7, fz_kontrolliert = $8, gs_eingetragen = $9, gs_abgelaufen = $10, gs_kontrolliert = $11, us_eingetragen = $12, us_abgelaufen = $13, us_kontrolliert = $14, sve_eingetragen = $15, sve_kontrolliert = $16
            WHERE id = $1
            RETURNING *`;
        const result = await pool.query(query, [
            data.id,
            data.name || null,
            data.vorname || null,
            data.email || null,
            data.postadresse || null,
            data.fz_eingetragen || null,
            data.fz_abgelaufen || null,
            data.fz_kontrolliert || null,
            data.gs_eingetragen || null,
            data.gs_abgelaufen || null,
            data.gs_kontrolliert || null,
            data.us_eingetragen || null,
            data.us_abgelaufen || null,
            data.us_kontrolliert || null,
            data.sve_eingetragen || null,
            data.sve_kontrolliert || null,
        ]);
        return result.rows[0];
    } catch (err) {
        throw new Error('Error updating data');
    }
};

// delete an employee
const deleteEmployeeQuery = async (id) => {
    try {
        const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (err) {
        throw new Error('Error deleting data');
    }
}

module.exports = {
    getDatafromDBQuery,
    insertNewEmployeeQuery,
    updateEmployeeQuery,
    deleteEmployeeQuery,
};