const { sendEmail } = require('./mailer/mailer');
const pool = require('./db');

const expiryMail = async () => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const query = `SELECT * FROM employees_new WHERE fz_abgelaufen < $1`;

  try {
    await checkDatabaseConnection();
    const res = await pool.query(query, [today]);
    res.rows.forEach(async (row) => {
      try {
        const email = row.email;
        const message = `
          <h1>Führungszeugnis abgelaufen</h1>
          <p>Hallo --Name hier einfügen--,</p>
          <div>Ihr Führungszeugnis ist abgelaufen. Im Anhang finden Sie die PDF.</div>
          <div>Schicken Sie die ausgefüllte PDF an --EMAIL einfügen--</div>
        `;
        await sendEmail(email, 'Führungszeugnis abgelaufen', message);
      } catch (error) {
        console.error(`Failed to send email to ${row.email}:`, error);
      }
    });
  } catch (error) {
    console.error('Error checking nachweise:', error.message);
    console.error(error.stack);
  }
};

module.exports = expiryMail;