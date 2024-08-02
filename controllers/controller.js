/**
 * This file contains the controller functions for the API.
 * Its functions gets called in the main.js file.
 * The controller functions are responsible for handling the request and response.
 * The controller functions call the database functions from queries.js to interact with the database.
 */
// const pool = require('../db');
const queries = require('../queries/queries');
const { getDatafromDatabase, getExampleData, insertExampleData } = require('../queries/queries');


// get * from database
const getDatafromDB = async (req, res) => {
    try {
        const result = await getDatafromDatabase();
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// insert data into the database
const createExample = async (req, res) => {
    try {
        const data = req.body;
        const result = await insertExampleData(data);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getDatafromDB,
    createExample,
};
