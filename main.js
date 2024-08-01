const express = require("express");
const cors = require("cors");
const db = require('./db');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    // console.log("Handling route /");
    res.json({ message: "main.js page" });
    // console.log("Response sent for route /");
});

// Route für die SQL-Abfrage
app.get('/api/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pqtest');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

//   express seems like to have a problem with the lines below
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});