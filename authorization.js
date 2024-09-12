/**
 * This file contains the routes for the registration and login for admin and users.
 * Its functions gets called in the main.js file.
 */

const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');
const pool = require('./db'); // PostgreSQL connection pool

const jwt = require('jsonwebtoken'); //web token


// Benutzer-Registrierung
const register = async (req, res) => {
  const { email, password, role } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const emailExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailExists.rowCount > 0) {
      return res.status(400).json({ message: 'E-Mail-Adresse bereits vorhanden' });
    }

    // save user to database
    const result = await pool.query(
      "INSERT INTO users (email, password, role_id) VALUES ($1, $2, (SELECT id FROM roles WHERE name = $3))",
      [email, hashedPassword, role]
    );

    console.log("Database insert result:", result); // Add this to log the result of the query


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
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user) return res.status(400).json({ message: 'E-Mail oder Passwort falsch!' });

    // Passwortvergleich
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    if (!isMatch) return res.status(400).json({ message: 'E-Mail oder Passwort falsch!' });

    // Generating a JWT token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id }, // Payload, which can include user info like id and role
      process.env.JWT_SECRET,           // Secret key from environment variables
      { expiresIn: '1h' }               // Token expiration time
    );

    // Erfolgreicher Login - Sende Token zurück
    res.json({
      message: 'Login erfolgreich',
      token,  // Send the generated token to the client
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Fehler beim Login', error: error.message });
  }

};


module.exports = {
  register,
  login,
};