const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

const db = require("./database/models");

db.sequelize.sync();

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

require('./api/routes/auth')(app);
require('./api/routes/user')(app);
require('./api/routes/book')(app);

module.exports = app;

