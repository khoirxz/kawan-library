var { Sequelize } = require("sequelize");

var db = new Sequelize(
  process.env.TABLE,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = db;
