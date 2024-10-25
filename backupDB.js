const { Parser } = require('json2csv');
const cron = require('node-cron');
const pool = require('./db');
const { sendEmail } = require('./mailer/mailer');

// Function to fetch data from the database and convert it to CSV
const backupDatabaseToCSV = async () => {
  try {
    const res = await pool.query('SELECT * FROM employees_new'); // Adjust table name here
    const json2csvParser = new Parser();
    return json2csvParser.parse(res.rows);
  } catch (error) {
    console.error('Error fetching data from database:', error);
  }
};

// Set up cron job to run every hour
cron.schedule('0 0 1 */2 *', async () => {
  console.log('Running database backup job');
  const csvData = await backupDatabaseToCSV();
  if (csvData) {
    try {
      const email = "test@mail.de"; //placeholder email
      await sendEmail(email, 'Database Backup', 'Your database backup is attached.', csvData, 'database_backup.csv');
      console.log('Backup email sent');
    } catch (error) {
      console.error('Error sending backup email:', error);
    }
  }
});

// setInterval(async () => {
//   console.log('Running database backup job');
//   const csvData = await backupDatabaseToCSV();
//   if (csvData) {
//     try {
//       const email = "test@mail.de";
//       await sendEmail(email, 'Database Backup', 'Your database backup is attached.', csvData, 'database_backup.csv');
//       console.log('Backup email sent');
//     } catch (error) {
//       console.error('Error sending backup email:', error);
//     }
//   }  
// }, 2000); // 2000 milliseconds = 2 seconds


module.exports = backupDatabaseToCSV;
