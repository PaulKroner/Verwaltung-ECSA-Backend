require('dotenv').config();

const express = require("express");
const cors = require("cors");
const db = require('./db');
const app = express();
const port = 8080;
const controller = require('./controllers/controller');
const { authorize } = require('./controllers/authorization-controller');
const authorization = require('./authorization');


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

//authorization

app.post('/register', authorization.register);
app.post('/login', authorization.login);

app.get('/admin', authorize(['Admin']), (req, res) => {
  res.send('Willkommen Admin');
});

app.get('/user', authorize(['User', 'Admin']), (req, res) => {
  res.send('Willkommen User');
});

// express seems like to have a problem with the lines below
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});