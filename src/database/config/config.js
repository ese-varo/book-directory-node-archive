require('dotenv').config();

module.exports = {
  "development": {
    "username": "bookfull",
    "password": "bookfull",
    "database": "bookfull_development",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "bookfull",
    "password": "bookfull",
    "database": "bookfull_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "126.0.0.1",
    "dialect": "mysql"
  }
};