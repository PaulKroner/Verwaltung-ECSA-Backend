const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

    // send email
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: 'your-email@gmail.com',
    //     pass: 'your-app-password',
    //   },
    // });
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'gilberto.lindgren70@ethereal.email',
        pass: 'KSZ2TqeZfKMqPuFCUp'
      }
    });

    const resetLink = `http://localhost:3000/pages/registration/resetPassword/${token}`;


    const mailOptions = {
      from: 'gilberto.lindgren70@ethereal.email', // Ändere dies auf deine Ethereal-E-Mail
      to: email,
      subject: 'Passwort zurücksetzen',
      html: `<p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    };

    transporter.sendMail(mailOptions).then(info => {
      console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    });

    // await transporter.sendMail(mailOptions);

    res.json({ message: 'E-Mail zum Zurücksetzen des Passworts wurde gesendet.' });
  } catch (error) {
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten.' });
    console.log(error.message)
  }
};

module.exports = {
  sendPasswordResetEmail,
}