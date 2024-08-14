const express = require("express");
const cors = require("cors");
const db = require('./db');
const app = express();
const port = 8080;
const controller = require('./controllers/controller');

app.use(cors());
app.use(express.json());

// get everything from database
app.get('/api/getdata', controller.getDatafromDB);

// create a new employee
app.post('/api/create', controller.createEmployee);

// delete an employee
app.delete('/api/delete/:id', controller.deleteEmployeeFromDB);

app.get("/", (req, res) => {
    res.json({ message: "main.js page" });
});

// express seems like to have a problem with the lines below
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});