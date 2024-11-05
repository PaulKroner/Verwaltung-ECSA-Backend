/**
 * This file contains all the queries that will be used to interact with the database.
 * The queries are exported and used in the controller functions.
 */
const pool = require('../db');
const tableName = 'employees_new';
exports.tableName = tableName;
const { validateEmployeeData, checkDatabaseConnection } = require('../utils/utils');

// get * query for the overview-table
const getDatafromDBQuery = async () => {
  try {
    await checkDatabaseConnection();
    const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY name;`);
    return result.rows;
  } catch (err) {
    throw new Error(`Fehler beim Abfragen der Datenbank: ${err.message}`);
  }
};

// insert new employee
const insertNewEmployeeQuery = async (data) => {
  try {
    await checkDatabaseConnection();
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
    await checkDatabaseConnection();
    validateEmployeeData(data);
    const query = `
            UPDATE ${tableName}
            SET name = $2, vorname = $3, email = $4, postadresse = $5, fz_eingetragen = $6, fz_abgelaufen = $7, fz_kontrolliert = $8, fz_kontrolliert_am = $9, gs_eingetragen = $10, gs_erneuert = $11, gs_kontrolliert = $12, us_eingetragen = $13, us_abgelaufen = $14, us_kontrolliert = $15, sve_eingetragen = $16, sve_kontrolliert = $17, hauptamt = $18
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
      data.fz_kontrolliert_am || null,
      data.gs_eingetragen || null,
      data.gs_erneuert || null,
      data.gs_kontrolliert || null,
      data.us_eingetragen || null,
      data.us_abgelaufen || null,
      data.us_kontrolliert || null,
      data.sve_eingetragen || null,
      data.sve_kontrolliert || null,
      data.hauptamt || false,
    ]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw new Error(`Fehler beim Updaten eines Mitarbeiters: ${err.message}`);
  }
};

// delete an employee
const deleteEmployeeQuery = async (id) => {
  try {
    await checkDatabaseConnection();
    const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Fehler beim Löschen eines Mitarbeiters: ${err.message}`);
  }
}

const getDataRolesQuery = async () => {
  try {
    await checkDatabaseConnection();
    const result = await pool.query("SELECT id, email, name, vorname, role_id AS role FROM users");
    return result.rows;
  } catch (error) {
    throw new Error(`Fehler beim Löschen eines Users: ${error.message}`);
  }
}

// delete a user query
const deleteUserQuery = async (id) => {
  try {
    await checkDatabaseConnection();
    const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Fehler beim Löschen eines Users: ${err.message}`);
  }
};

const updateUserQuery = async (data) => {
  try {
    await checkDatabaseConnection();
    const query = `
            UPDATE users
            SET email = $2, role_id = $3, name = $4, vorname = $5
            WHERE id = $1
            RETURNING *`;

    console.log(data.id,
      data.email || null,
      data.role || null,
      data.name || null,
      data.vorname || null,)

    const result = await pool.query(query, [
      data.id,
      data.email || null,
      data.role || null,
      data.name || null,
      data.vorname || null,
    ]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Fehler beim Updaten eines Users: ${err.message}`);
  }
}

module.exports = {
  getDatafromDBQuery,
  insertNewEmployeeQuery,
  updateEmployeeQuery,
  deleteEmployeeQuery,
  getDataRolesQuery,
  deleteUserQuery,
  updateUserQuery,
};