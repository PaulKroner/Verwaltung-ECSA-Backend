/**
 * This file contains the functions to reset the password if the token is valid.
 * It hashes the new password and updates the user's password in the database.
 */

const pool = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load .env file
const salt = process.env.BCRYPT_SALT;

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Suche den User mit dem Token und überprüfe, ob der Token gültig ist
  const result = await pool.query(
    `SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()`,
    [token]
  );

  if (result.rows.length === 0) {
    return res.status(400).send('Token ist ungültig oder abgelaufen.');
  }

  const user = result.rows[0];

  // hash password
  // const salt = await bcrypt.genSalt();
  const hashedPassword = bcrypt.hashSync(newPassword, salt);

  // Aktualisiere das Passwort in der Datenbank
  await pool.query(
    `UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2`,
    [hashedPassword, user.email]
  );

  res.send('Passwort erfolgreich zurückgesetzt.');
};

module.exports = {
  resetPassword,
};