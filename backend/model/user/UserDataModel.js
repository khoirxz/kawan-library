const Squelize = require("sequelize");
const db = require("../../config/database");

const DataTypes = Squelize.DataTypes;

const UserData = db.define("user_data", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.CHAR,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  nik: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateBirth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM("male", "female"),
    allowNull: false,
  },
  religion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maritalStatus: {
    type: DataTypes.ENUM("single", "married", "widow"),
    allowNull: false,
  },
});

module.exports = UserData;
