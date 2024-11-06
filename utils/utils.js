/**
 * This file contains helper functions.
 */

const pool = require('../db');

// helper function to check if 
// data.name, data.vorname and data.'_kontrolliert' contains only letters
const isAlpha = (str) => /^[\p{L}\s-]+$/u.test(str);

const validateEmployeeData = (data) => {
  // Check if 'name' and 'vorname' only contain letters
  if (!isAlpha(data.name)) {
    throw new Error('Name darf nur Buchstaben enthalten');
  }
  if (!isAlpha(data.vorname)) {
    throw new Error('Vorname darf nur Buchstaben enthalten');
  }

  // Check if any key containing '_kontrolliert' only contains letters
  for (const [key, value] of Object.entries(data)) {
    if (key.includes('_kontrolliert') && key !== 'fz_kontrolliert_am') {
      if (!isAlpha(value) && value !=='') {
        throw new Error(`${key} darf nur Buchstaben enthalten`);
      }
    }
  }
};

// Function to check database connectivity
const checkDatabaseConnection = async () => {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    throw new Error('Die Datenbank ist nicht erreichbar.');
  }
};


module.exports = {
  validateEmployeeData,
  checkDatabaseConnection,
};