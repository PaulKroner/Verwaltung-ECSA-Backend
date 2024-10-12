const { sendEmail } = require('./mailer/mailer');
const pool = require('./db');

const expiryMail = async () => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const query = `SELECT * FROM employees_new WHERE fz_abgelaufen < $1`;

  try {
    const res = await pool.query(query, [today]);
    res.rows.forEach(async (row) => {
      try {
        const email = row.email;
        const message = `Your nachweis with ID ${row.id} has expired. Please take the necessary actions.`;
        await sendEmail(email, 'Nachweis Expiration Notice', message);
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