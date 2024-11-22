/**
 * This file contains the functions to reset the password if the token is valid.
 * It hashes the new password and updates the user's password in the database.
 */

const pool = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load .env file
const salt = process.env.BCRYPT_SALT;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find the user with the reset token and ensure it hasn't expired
    const user = await prisma.users.findFirst({
      where: {
        reset_token: token,
      },
      select: {
        email: true,
        reset_token_expiry: true,
      },
    });

    // Check if the user exists and the reset token has expired
    if (!user || user.reset_token_expiry < new Date()) {
      return res.status(400).send('Token ist ungültig oder abgelaufen.');
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update the user's password and clear the reset token details
    await prisma.users.update({
      where: {
        email: user.email,
      },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      },
    });

    res.send('Passwort erfolgreich zurückgesetzt.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Etwas ist schief gelaufen.');
  }
};

module.exports = {
  resetPassword,
};

module.exports = {
  resetPassword,
};