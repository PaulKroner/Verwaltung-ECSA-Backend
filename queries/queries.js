/**
 * This file contains all the queries that will be used to interact with the database.
 * The queries are exported and used in the controller functions.
 */
const pool = require('../db');
const tableName = 'employees_new';
const { validateEmployeeData } = require('../utils/utils');

// get * query for the overview-table
const getDatafromDBQuery = async () => {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY name;`);
    return result.rows;
  } catch (err) {
    throw new Error(`Fehler beim Abfragen der Datenbank: ${err.message}`);
  }
};

// insert new employee
const insertNewEmployeeQuery = async (data) => {
  try {

    validateEmployeeData(data);
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
    throw new Error(`Fehler beim Hinzufügen eines neuen Mitarbeiters: ${err.message}`);
  }
};

// update an employee
const updateEmployeeQuery = async (data) => {
  try {
    validateEmployeeData(data);
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
    throw new Error(`Fehler beim Updaten eines Mitarbeiters: ${err.message}`);
  }
};

// delete an employee
const deleteEmployeeQuery = async (id) => {
  try {
    const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Fehler beim Löschen eines Mitarbeiters: ${err.message}`);
  }
}

const getDataRolesQuery = async () => {
  try {
    const result = await pool.query("SELECT id, email, name, vorname, role_id AS role FROM users");
    return result.rows;
  } catch (error) {
    console.error(error.message);
  }
}

// delete a user query
const deleteUserQuery = async (id) => {
  try {
    const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Fehler beim Löschen eines Users: ${err.message}`);
  }
};

module.exports = {
  getDatafromDBQuery,
  insertNewEmployeeQuery,
  updateEmployeeQuery,
  deleteEmployeeQuery,
  getDataRolesQuery,
  deleteUserQuery,
};