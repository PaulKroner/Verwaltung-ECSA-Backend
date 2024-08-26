/**
 * This file contains helper functions.
 */

// helper function to check if 
// data.name, data.vorname and data.'_kontrolliert' contains only letters
const isAlpha = (str) => /^[a-zA-Z]+$/.test(str);
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
    if (key.includes('_kontrolliert')) {
      if (!isAlpha(value)) {
        throw new Error(`${key} darf nur Buchstaben enthalten`);
      }
    }
  }
};

module.exports = {
  validateEmployeeData,
};