/**
 * This file contains the routes for the registration and login for admin and users.
 * Its functions gets called in the main.js file.
 */

const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load .env file
const salt = process.env.BCRYPT_SALT;
const { validationResult } = require('express-validator');
const pool = require('./db'); // MySQL connection pool
const jwt = require('jsonwebtoken'); //web token
const { checkDatabaseConnection } = require('./utils/utils');

// Benutzer-Registrierung
const register = async (req, res) => {
  const { email, password, role, name, vorname } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // await checkDatabaseConnection();
    // hash password
    const hashedPassword = bcrypt.hashSync(password, salt);

    const emailExists = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (emailExists.rowCount > 0) {
      return res.status(400).json({ message: 'E-Mail-Adresse ist bereits vorhanden' });
    }

    // save user to database
    const result = await pool.query(
      "INSERT INTO users (email, password, role_id, name, vorname) VALUES (?, ?, ?, ?, ?)",
      [email, hashedPassword, role, name, vorname]
    );

    res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  } catch (error) {
    console.error("Error during registration:", error); // Log the full error
    res.status(500).json({ message: 'Fehler beim Registrieren', error });
  }
};


// Benutzer-Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // await checkDatabaseConnection();
    const [userResult] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    const user = userResult;

    if (!user) return res.status(400).json({ message: 'E-Mail oder Passwort falsch!' });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'E-Mail oder Passwort falsch!' });

    // Generating a JWT token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id }, // Payload
      process.env.JWT_SECRET,                 // Secret key
      { expiresIn: "2d" }                     // Token expiration time
    );

    // Successful login - Send token back
    res.json({
      message: 'Login erfolgreich',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Login' });
  }
};



module.exports = {
  register,
  login,
};