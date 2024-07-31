const express = require("express");
const cors = require("cors");
const db = require('./db');
const app = express();
const port = 8080;

const overviewRoute = require("./routes/overview");
const testdbRoute = require("./routes/testDB");

app.use(cors());  // Use the cors middleware

// Middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`Received request for ${req.path}`);
    next();
});

app.get("/", (req, res) => {
    console.log("Handling route /");
    res.json({ message: "Route /" });
    console.log("Response sent for route /");
});

app.get("/api/test", (req, res) => {
    console.log("Handling route /api/test");
    res.json({ message: "Hello, World!", people: ["Harry", "Paul", "Peter"] });
    console.log("Response sent for route /api/test");
});

// Use routes
app.use('/overview', overviewRoute);
app.use('/testdb', testdbRoute);

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

db.query(`Select * from pgtest`, (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res.rows);
        console.log("2. mal")
    }
});