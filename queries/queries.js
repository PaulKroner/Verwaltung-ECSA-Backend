/**
 * This file contains all the queries that will be used to interact with the database.
 * The queries are exported and used in the controller functions.
 */
require('dotenv').config();
const pool = require('../db');
const tableNameEmployees = process.env.DB_EMPLOYEES
// exports.tableName = tableName;
const { validateEmployeeData, checkDatabaseConnection } = require('../utils/utils');

// get * query for the overview-table
const getDatafromDBQuery = async () => {
  try {
    // await checkDatabaseConnection();
    const rows = await pool.query(`SELECT * FROM ?? ORDER BY name`, [tableNameEmployees]);
    return rows;
  } catch (err) {
    throw new Error(`Fehler beim Abfragen der Datenbank: ${err.message}`);
  }
};

// insert new employee
const insertNewEmployeeQuery = async (data) => {
  try {
    // await checkDatabaseConnection();
    validateEmployeeData(data);
    // Extract keys and values from the data object
    const keys = Object.keys(data);
    const values = Object.values(data);

    // Build the columns part of the query
    const columns = keys.join(', ');

    const placeholders = keys.map(() => '?').join(', ');

    const query = `
          INSERT INTO ${tableNameEmployees} (${columns})
          VALUES (${placeholders})
      `;

    const result = await pool.query(query, values);
    const [insertedEmployee] = await pool.query(`SELECT * FROM ${tableNameEmployees} WHERE id = ?`, [result.insertId]);

    return insertedEmployee[0];
  } catch (err) {
    throw new Error(`Fehler beim Hinzufügen eines neuen Mitarbeiters: ${err.message}`);
  }
};

// update an employee
const updateEmployeeQuery = async (data) => {
  try {
    // Validate the data and ensure dates are in the correct format (e.g., 'YYYY-MM-DD')
    validateEmployeeData(data);

    console.log(data)

    const query = `
      UPDATE ${tableNameEmployees}
      SET 
        name = ?, 
        vorname = ?, 
        email = ?, 
        postadresse = ?, 
        fz_eingetragen = ?, 
        fz_abgelaufen = ?, 
        fz_kontrolliert = ?, 
        fz_kontrolliert_am = ?, 
        gs_eingetragen = ?, 
        gs_erneuert = ?, 
        gs_kontrolliert = ?, 
        us_eingetragen = ?, 
        us_abgelaufen = ?, 
        us_kontrolliert = ?, 
        sve_eingetragen = ?, 
        sve_kontrolliert = ?, 
        hauptamt = ?
      WHERE id = ?
    `;

    const result = await pool.query(query, [
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
      data.id
    ]);

    console.log("result: ", result)

    return result;
  } catch (err) {
    console.log(err);
    throw new Error(`Fehler beim Updaten eines Mitarbeiters: ${err.message}`);
  }
};

// delete an employee
const deleteEmployeeQuery = async (id) => {
  try {
    // await checkDatabaseConnection();

    const result = await pool.query(`DELETE FROM ${tableNameEmployees} WHERE id = ?`, [id]);

    return result[0];
  } catch (err) {
    throw new Error(`Fehler beim Löschen eines Mitarbeiters: ${err.message}`);
  }
}

const getDataRolesQuery = async () => {
  try {
    // await checkDatabaseConnection();
    const result = await pool.query("SELECT id, email, name, vorname, role_id AS role FROM users");
    return result;
  } catch (error) {
    throw new Error(`Fehler beim Löschen eines Users: ${error.message}`);
  }
}

// delete a user query
const deleteUserQuery = async (id) => {
  try {
    // await checkDatabaseConnection();

    const result = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
    return result[0];
  } catch (err) {
    throw new Error(`Fehler beim Löschen eines Users: ${err.message}`);
  }
};

const updateUserQuery = async (data) => {
  try {
    // await checkDatabaseConnection();
    const query = `
      UPDATE users
      SET email = ?, role_id = ?, name = ?, vorname = ?
      WHERE id = ?
    `;

    const result = await pool.query(query, [
      data.email || null,
      data.role || null,
      data.name || null,
      data.vorname || null,
      data.id,
    ]);
    return result;
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