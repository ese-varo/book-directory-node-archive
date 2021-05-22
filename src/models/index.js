const config = require("../config/database.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/user.js")(sequelize, Sequelize);
db.books = require("../models/book.js")(sequelize, Sequelize);

db.users.hasMany(db.books, { as: "books" });
db.books.belongsTo(db.users, {
  foreignKey: "userId",
  as: 'user'
});

module.exports = db;
