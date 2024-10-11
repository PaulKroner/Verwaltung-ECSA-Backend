/**
 * This file contains the functions to send a request to reset the password by sending an email
 * with a reset link to the user.
 * It generates a random token, sets an expiry date and saves the token and expiry date to the database.
 * It sends an email with a reset link to the user.
 */

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sendEmail } = require('./mailer/mailer');
const pool = require('./db'); // Verbindung zur Datenbank

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  try {

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Benutzer nicht gefunden.' });
    }

    const user = result.rows[0];

    // generate reset-token
    const token = crypto.randomBytes(32).toString('hex');

    // set expiry date to 15 minutes from now
    const expiryDate = new Date(Date.now() + 900000); // 15 min in milliseconds

    // save token and expiry date to database
    await pool.query(
      `UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3`,
      [token, expiryDate, email]
    );

    const resetLink = `http://localhost:3000/registration/resetPassword/${token}`;
    const htmlContent = `
      <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    // send email
    await sendEmail(email, 'Passwort zurücksetzen', htmlContent);

    res.json({ message: 'E-Mail zum Zurücksetzen des Passworts wurde gesendet.' });
  } catch (error) {
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten.' });
    console.log(error.message)
  }
};

module.exports = {
  sendPasswordResetEmail,
}