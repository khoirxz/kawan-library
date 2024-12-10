// define to avoid circular dependencies

const UsersModel = require("./user/UsersModel");
const UserDataModel = require("./user/UserDataModel");
const UserContactModel = require("./user/UserContactModel");
const UserDataEmployeModel = require("./user/UserDataEmployeModel");
const UserGeographyModel = require("./user/UserGeographyModel");
const UserJobHistoryModel = require("./user/UserJobHistoryModel");
const DecreesModel = require("./DecreesModel");
const DecreeCategoryModel = require("./DecreeCategoryModel");
const CertificationsModel = require("./CertificationsModel");

UsersModel.hasOne(UserDataModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel user data
  as: "user_data", // Alias untuk relasi
});

UsersModel.hasOne(UserContactModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel user data
  as: "user_contact", // Alias untuk relasi
});

UsersModel.hasOne(UserDataEmployeModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel user data
  as: "user_data_employe", // Alias untuk relasi
});

UsersModel.hasOne(UserGeographyModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel user data
  as: "user_geography", // Alias untuk relasi
});

UsersModel.hasMany(DecreesModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel decrees
  as: "decrees", // Alias untuk relasi
});

UsersModel.hasOne(UserDataModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel user data
  as: "user_info", // Alias untuk relasi
});

UsersModel.hasMany(CertificationsModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel decrees
  as: "certifications", // Alias untuk relasi
});

UsersModel.hasMany(UserJobHistoryModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel decrees
  as: "job_history", // Alias untuk relasi
});

UserDataEmployeModel.belongsTo(UsersModel, {
  foreignKey: "supervisor", // Sesuai kolom foreign key di tabel userDataEmploye
  as: "supervisor_info", // Alias untuk relasi
});

DecreesModel.belongsTo(UsersModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel decrees
  as: "user", // Alias untuk relasi
});

DecreesModel.belongsTo(DecreeCategoryModel, {
  foreignKey: "category_id", // Sesuai kolom foreign key di tabel decrees
  as: "category", // Alias untuk relasi
});

CertificationsModel.belongsTo(UsersModel, {
  foreignKey: "user_id", // Sesuai kolom foreign key di tabel decrees
  as: "user", // Alias untuk relasi
});

module.exports = {
  UsersModel,
  UserDataModel,
  UserContactModel,
  UserDataEmployeModel,
  UserGeographyModel,
  UserJobHistoryModel,
  DecreesModel,
  DecreeCategoryModel,
  CertificationsModel,
};
