const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

const overviewRoute = require("./routes/overview");

app.use(cors());  // Use the cors middleware

app.get("/", (req, res) => {
    res.json({ message: "Route /" });
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Hello, World!", people: ["Harry", "Paul", "Peter"] });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Use routes
app.use('/overview', overviewRoute);