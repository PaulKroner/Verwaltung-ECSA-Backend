/**
 * This file contains all the queries that will be used to interact with the database.
 * The queries are exported and used in the controller functions.
 */
const pool = require('../db');
const tableName = 'pgtest';

// get * query for the overview-table
const getDatafromDatabase = async () => {
    try {
        const result = await pool.query(`SELECT * FROM ${tableName}`);
        console.log("Select wird ausgeführt")
        return result.rows;
    } catch (err) {
        console.log("Select wird nicht ausgeführt")
        throw new Error('Error fetching data from database');
        
    }
};

// example for Insert data
const insertExampleData = async (data) => {
    try {
        const query = `INSERT INTO ${tableName} (testval, nachweis1, name) VALUES ($1, $2, $3) RETURNING *`;
        const result = await pool.query(query, [data.column1, data.column2]);
        return result.rows[0];
    } catch (err) {
        throw new Error('Error inserting data into database');
    }
};

module.exports = {
    getDatafromDatabase,
    insertExampleData,
};