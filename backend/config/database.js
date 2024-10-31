const { Sequelize } = require("sequelize");
const { globals } = require("./config");

const db = new Sequelize(globals.TABLE, globals.USER, globals.PASSWORD, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
