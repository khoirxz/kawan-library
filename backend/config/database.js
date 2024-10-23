var { Sequelize } = require("sequelize");
const { globals } = require("./config");

var db = new Sequelize(globals.TABLE, globals.USER, globals.PASSWORD, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
