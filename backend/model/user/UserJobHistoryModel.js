const Sequelize = require("sequelize");
const db = require("../../config/database");

const DataTypes = Sequelize.DataTypes;

const JobHistory = db.define("user_job_history", {
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
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  job_description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_current: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = JobHistory;
