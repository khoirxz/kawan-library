const Sequelize = require("sequelize");
const db = require("../config/database");

const DataTypes = Sequelize.DataTypes;

const Decrees = db.define("decrees", {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "decrees_categories",
      key: "id",
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("draft", "approved", "canceled"),
    allowNull: false,
  },
  effective_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  expired_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Decrees;
