require('dotenv').config();

const express = require("express");
const cors = require("cors");
const db = require('./db');
const app = express();
const port = 8080;
const cron = require('node-cron');
const controller = require('./controllers/controller');
const authorization = require('./authorization');
const resetPasswordController = require('./resetPasswordController')
const sendPasswordResetEmail = require('./sendPasswordResetEmail');
const expiryMail = require('./expiryMail');

app.use(cors());
app.use(express.json());

// get everything from database
app.get('/api/getdata', controller.getDatafromDB);

// create a new employee
app.post('/api/create', controller.createEmployee);

// update an employee
app.put('/api/update/:id', controller.updateEmployee);

// delete an employee
app.delete('/api/delete/:id', controller.deleteEmployee);

app.get("/", (req, res) => {
  res.json({ message: "main.js page" });
});

// get all users from users table
app.get('/api/getDataRoles', controller.getDataRoles);

//authorization
app.post('/register', authorization.register);
app.post('/login', authorization.login);

// User routes
app.delete('/api/deleteUser/:id', controller.deleteUser);
app.put('/api/updateUser/:id', controller.updateUser);

// password reset
app.post('/api/resetPassword', resetPasswordController.resetPassword);
app.post('/api/sendResetPasswordEmail', sendPasswordResetEmail.sendPasswordResetEmail);

// expiry mail
const triggerExpiryMail = async () => {
  try {
    await expiryMail(); // Call the expiryMail function
    console.log('Expiry mail check completed!');
  } catch (error) {
    console.error('Error occurred while checking expiry mail:', error);
  }
};

// Schedule expiry mail to run daily at midnight
cron.schedule('0 0 * * *', () => {
  triggerExpiryMail();
});

// Test route to manually trigger expiryMail function
app.get('/test-expiry-mail', async (req, res) => {
  try {
    await triggerExpiryMail();
    res.send('Expiry mail check completed!');
  } catch (error) {
    res.status(500).send('Error occurred while checking expiry mail.');
  }
});



// express seems like to have a problem with the lines below
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});