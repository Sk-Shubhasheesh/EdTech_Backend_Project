const express = require("express");
const app = express();
const db = require("./config/database.js")
require("dotenv").config();
// Port find
const PORT = process.env.PORT || 3000;
// db connection
db.connect();

// active server
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})
