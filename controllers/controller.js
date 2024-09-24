/**
 * This file contains the controller functions for the API.
 * Its functions gets called in the main.js file.
 * The controller functions are responsible for handling the request and response.
 * The controller functions call the database functions from queries.js to interact with the database.
 */

const queries = require('../queries/queries');
const { getDatafromDBQuery, insertNewEmployeeQuery, updateEmployeeQuery, deleteEmployeeQuery, getDataRolesQuery, deleteUserQuery, updateUserQuery} = require('../queries/queries');


// get * from database
const getDatafromDB = async (req, res) => {
    try {
        const result = await getDatafromDBQuery();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// create a new employee
const createEmployee = async (req, res) => {
    try {
        const data = req.body;
        const result = await insertNewEmployeeQuery(data);
        res.status(201).json("Mitarbeiter wurde hinzugefügt");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update an employee
const updateEmployee = async (req, res) => {
    try {
        const result = await updateEmployeeQuery(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// delete an employee
const deleteEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await deleteEmployeeQuery(id);
        res.status(200).json("Mitarbeiter wurde gelöscht");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDataRoles = async (req, res) => {
    try {
        const users = await getDataRolesQuery();
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
    }
}

// delete a user
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await deleteUserQuery(id);
        res.status(200).json("User wurde gelöscht");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const result = await updateUserQuery(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getDatafromDB,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getDataRoles,
    deleteUser,
    updateUser,
};
