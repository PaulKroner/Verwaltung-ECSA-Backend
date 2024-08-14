/**
 * This file contains all the queries that will be used to interact with the database.
 * The queries are exported and used in the controller functions.
 */
const pool = require('../db');
const tableName = 'employees_new';

// get * query for the overview-table
const getDatafromDatabase = async () => {
    try {
        const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY id;`);
        return result.rows;
    } catch (err) {
        throw new Error('Error fetching data from database');

    }
};

// insert new employee
const insertNewEmployeeQuery = async (data) => {
    try {
        const query = `
            INSERT INTO ${tableName} 
            (name, vorname, email, postadresse, fz_eingetragen, fz_abgelaufen, fz_kontrolliert, gs_eingetragen, gs_abgelaufen, gs_kontrolliert, us_eingetragen, us_abgelaufen, us_kontrolliert, sve_eingetragen, sve_kontrolliert) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
            RETURNING *`;
        const result = await pool.query(query, [
            data.name,
            data.vorname,
            data.email,
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
        throw new Error('Error inserting data into the database');
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