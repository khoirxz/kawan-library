const Squelize = require("sequelize");
const db = require("../../config/database");

const DataTypes = Squelize.DataTypes;

const UserDataEmploye = db.define("user_data_employe", {
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
  supervisor: {
    type: DataTypes.CHAR,
    defaultValue: DataTypes.UUIDV4,
    allowNull: true,
    references: {
      model: "users",
      key: "id",
    },
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
  },
  // "id_salary" adalah id dari tabel u5126114_gaji
  // id_salary diisi dengan nilai id dari tb_karyawan
  id_salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = UserDataEmploye;
