/**
 * This file contains the routes for the registration and login for admin and users.
 * Its functions gets called in the main.js file.
 */

const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load .env file
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); //web token

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Benutzer-Registrierung
const register = async (req, res) => {
  const { email, password, role, name, vorname } = req.body;
  const errors = validationResult(req);
  const saltRounds = 10;

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if email already exists
    const emailExists = await prisma.users.findUnique({
      where: { email },
    });    

    if (emailExists) {
      return res.status(400).json({ message: 'E-Mail-Adresse ist bereits vorhanden' });
    }

    // Hash the password
    const salt = process.env.BCRYPT_SALT; // Load salt from environment variable
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Save user to the database
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        role_id: role, // Assuming `role` is correctly mapped to the `role_id` field
        name,
        vorname,
      },
    });

    res.status(201).json({ message: 'Benutzer erfolgreich registriert', user: newUser });
  } catch (error) {
    console.error("Error during registration:", error); // Log the full error
    res.status(500).json({ message: 'Fehler beim Registrieren', error });
  }
};


// Benutzer-Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: 'E-Mail oder Passwort falsch!' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'E-Mail oder Passwort falsch!' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id }, // Payload
      process.env.JWT_SECRET,                // Secret key
      { expiresIn: "2d" }                    // Token expiration time
    );

    // Successful login
    res.json({
      message: 'Login erfolgreich',
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Fehler beim Login', error });
  }
};


module.exports = {
  register,
  login,
};