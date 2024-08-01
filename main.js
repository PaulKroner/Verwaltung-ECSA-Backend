const express = require("express");
const cors = require("cors");
const db = require('./db');
const app = express();
const port = 8080;
const controller = require('./controllers/controller');

app.use(cors());
app.use(express.json());

app.get('/api/example', controller.getDatafromDB);
app.post('/api/example2', controller.createExample);

app.get("/", (req, res) => {
    res.json({ message: "main.js page" });
    // console.log("main.js page");
});

//   express seems like to have a problem with the lines below
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});