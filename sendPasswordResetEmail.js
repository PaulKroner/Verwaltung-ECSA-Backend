/**
 * This file contains the functions to send a request to reset the password by sending an email
 * with a reset link to the user.
 * It generates a random token, sets an expiry date and saves the token and expiry date to the database.
 * It sends an email with a reset link to the user.
 */

const crypto = require('crypto');
const { sendEmail } = require('./mailer/mailer');
const pool = require('./db'); // Verbindung zur Datenbank

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    await checkDatabaseConnection();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // generate reset-token
    const token = crypto.randomBytes(32).toString('hex');

    // set expiry date to 15 minutes from now
    const expiryDate = new Date(Date.now() + 900000); // 15 min in milliseconds

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // save token and expiry date to database if user exists
      await pool.query(
        `UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3`,
        [token, expiryDate, email]
      );

      const resetLink = `http://localhost:3000/registration/resetPassword/${token}`;
      const message = `
        <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
        <a href="${resetLink}">${resetLink}</a>
      `;

      // send email
      await sendEmail(email, 'Passwort zurücksetzen', message);
    }

    // Gebe immer die gleiche Antwort zurück, unabhängig davon, ob die E-Mail existiert oder nicht
    res.json({ message: 'Wenn ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet.' });
  } catch (error) {
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten.' });
    console.log(error.message);
  }
};

module.exports = {
  sendPasswordResetEmail,
};
