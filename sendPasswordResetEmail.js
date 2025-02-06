/**
 * This file contains the functions to send a request to reset the password by sending an email
 * with a reset link to the user.
 * It generates a random token, sets an expiry date and saves the token and expiry date to the database.
 * It sends an email with a reset link to the user.
 */

const crypto = require('crypto');
const { sendEmail } = require('./mailer/mailer');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // does not make any sense
    // Fetch the user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    // Always return the same response regardless of whether the user exists
    if (!user) {
      return res.json({
        message: 'Wenn ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet.',
      });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiry date to 15 minutes from now
    const expiryDate = new Date(Date.now() + 900000 + 3600000); // 15 minutes in milliseconds and 1 hour for the right timezone        

    // Save the reset token and expiry date to the database
    await prisma.users.update({
      where: { email },
      data: {
        reset_token: token,
        reset_token_expiry: expiryDate,
      },
    });

    // Create reset link
    const resetLink = `http://localhost:3000/registration/resetPassword/${token}`;
    const message = `
      <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    // Send the email
    await sendEmail(email, 'Passwort zurücksetzen', message);

    // Respond with a success message
    res.json({
      message: 'Wenn ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet.',
    });
  } catch (error) {
    // Log error and return a generic error response
    console.error(error.message);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten.' });
  }
};

module.exports = {
  sendPasswordResetEmail,
};
