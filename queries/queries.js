/**
 * This file contains all the queries that will be used to interact with the database.
 * The queries are exported and used in the controller functions.
 */
require('dotenv').config();
// exports.tableName = tableName;
const { validateEmployeeData } = require('../utils/utils');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// get * query for the overview-table
const getDatafromDBQuery = async () => {
  try {
    const employees = await prisma.employees.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return employees;
  } catch (err) {
    throw new Error(`Fehler beim Abfragen der Datenbank: ${err.message}`);
  }
};


// insert new employee
const insertNewEmployeeQuery = async (data) => {
  try {
    // Validate the input data
    validateEmployeeData(data);

    // Convert string dates to Date objects
    if (data.fz_eingetragen) data.fz_eingetragen = new Date(data.fz_eingetragen);
    if (data.fz_abgelaufen) data.fz_abgelaufen = new Date(data.fz_abgelaufen);
    if (data.fz_kontrolliert_am) data.fz_kontrolliert_am = new Date(data.fz_kontrolliert_am);
    if (data.gs_eingetragen) data.gs_eingetragen = new Date(data.gs_eingetragen);
    if (data.gs_erneuert) data.gs_erneuert = new Date(data.gs_erneuert);
    if (data.us_eingetragen) data.us_eingetragen = new Date(data.us_eingetragen);
    if (data.us_abgelaufen) data.us_abgelaufen = new Date(data.us_abgelaufen);
    if (data.sve_eingetragen) data.sve_eingetragen = new Date(data.sve_eingetragen);

    // Insert the new employee into the database
    const insertedEmployee = await prisma.employees.create({
      data,
    });

    return insertedEmployee;
  } catch (err) {
    throw new Error(`Fehler beim Hinzufügen eines neuen Mitarbeiters: ${err.message}`);
  }
};

// update an employee
const updateEmployeeQuery = async (data) => {
  try {
    // Validate the data
    validateEmployeeData(data);

    // Update the employee record in the database
    const updatedEmployee = await prisma.employees.update({
      where: {
        id: data.id, // Ensure `data.id` is provided to locate the record
      },
      data: {
        name: data.name || null,
        vorname: data.vorname || null,
        email: data.email || null,
        postadresse: data.postadresse || null,
        fz_eingetragen: data.fz_eingetragen ? new Date(data.fz_eingetragen) : null,
        fz_abgelaufen: data.fz_abgelaufen ? new Date(data.fz_abgelaufen) : null,
        fz_kontrolliert: data.fz_kontrolliert || null,
        fz_kontrolliert_am: data.fz_kontrolliert_am ? new Date(data.fz_kontrolliert_am) : null,
        gs_eingetragen: data.gs_eingetragen ? new Date(data.gs_eingetragen) : null,
        gs_erneuert: data.gs_erneuert ? new Date(data.gs_erneuert) : null,
        gs_kontrolliert: data.gs_kontrolliert || null,
        us_eingetragen: data.us_eingetragen ? new Date(data.us_eingetragen) : null,
        us_abgelaufen: data.us_abgelaufen ? new Date(data.us_abgelaufen) : null,
        us_kontrolliert: data.us_kontrolliert || null,
        sve_eingetragen: data.sve_eingetragen ? new Date(data.sve_eingetragen) : null,
        sve_kontrolliert: data.sve_kontrolliert || null,
        hauptamt: data.hauptamt || false,
      },
    });

    console.log("Updated employee: ", updatedEmployee);

    return updatedEmployee;
  } catch (err) {
    console.error(err);
    throw new Error(`Fehler beim Updaten eines Mitarbeiters: ${err.message}`);
  }
};


// delete an employee
const deleteEmployeeQuery = async (id) => {
  try {
    const parsedId = parseInt(id, 10); // Convert id to an integer
    if (isNaN(parsedId)) {
      throw new Error(`Ungültige ID: ${id}. Die ID muss eine Zahl sein.`);
    }

    const result = await prisma.employees.delete({
      where: {
        id: parsedId,
      },
    });

    return result[0];
  } catch (err) {
    throw new Error(`Fehler beim Löschen eines Mitarbeiters: ${err.message}`);
  }
};

const getDataRolesQuery = async () => {
  try {
    // Fetch user data with specific fields from the 'users' table
    const result = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        vorname: true,
        role_id: true, // `role_id` will be mapped as `role` when returning the result
      },
    });

    // Map the `role_id` to `role` in the returned result
    const mappedResult = result.map(user => ({
      ...user,
      role: user.role_id, // Rename `role_id` to `role`
    }));

    return mappedResult;
  } catch (error) {
    throw new Error(`Fehler beim Abrufen der Benutzerdaten: ${error.message}`);
  }
};

const deleteUserQuery = async (id) => {
  try {
    const parsedId = parseInt(id, 10); // Convert id to an integer
    if (isNaN(parsedId)) {
      throw new Error(`Ungültige ID: ${id}. Die ID muss eine Zahl sein.`);
    }

    const result = await prisma.users.delete({
      where: {
        id: parsedId,
      },
    });

    return result; // Prisma returns the deleted record by default
  } catch (err) {
    throw new Error(`Fehler beim Löschen eines Users: ${err.message}`);
  }
};


const updateUserQuery = async (data) => {
  try {
    // Validate the input data
    if (!data.id) {
      throw new Error("User ID is required.");
    }
    // Only validate role if it is provided
    if (data.role !== undefined && data.role !== null && typeof data.role !== 'number') {
      throw new Error("Role must be a number.");
    }

    if (data.email && typeof data.email !== 'string') {
      throw new Error("Email must be a string.");
    }

    // Check if user exists before updating
    const userExists = await prisma.users.findUnique({
      where: { id: data.id },
    });

    if (!userExists) {
      throw new Error("User not found");
    }

    // Update the user record
    const updatedUser = await prisma.users.update({
      where: {
        id: data.id, // Find the user by ID
      },
      data: {
        email: data.email ?? undefined, // Use `undefined` to skip empty fields
        role_id: data.role ?? undefined,
        name: data.name ?? undefined,
        vorname: data.vorname ?? undefined,
      },
    });

    return updatedUser; // Return the updated user record
  } catch (err) {
    console.error("Error details:", err);  // Log full error details
    throw new Error(`Fehler beim Updaten eines Users: ${err.message}`);
  }
};


module.exports = {
  getDatafromDBQuery,
  insertNewEmployeeQuery,
  updateEmployeeQuery,
  deleteEmployeeQuery,
  getDataRolesQuery,
  deleteUserQuery,
  updateUserQuery,
};