const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

const db = require("./src/models");

db.sequelize.sync();

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to book directory application." });
});

require('./src/routes/auth')(app);
require('./src/routes/user')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
