const Sequelize = require("sequelize");
const db = require("../../config/database");

const DataTypes = Sequelize.DataTypes;

const Users = db.define("users", {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  avatarImg: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
});

module.exports = Users;
