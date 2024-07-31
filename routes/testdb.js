const express = require('express');
const router = express.Router();

// define a router for Overview
router.get("/", (req, res) => {
    res.send('this is a database test route');// this gets executed when user visit http://localhost:8080/user
});

// export the router module so that server.js file can use it
module.exports = router;