const UsersModel = require("../../model/user/UsersModel");
const UserContactModel = require("../../model/user/UserContactModel");
const UserDataEmployeModel = require("../../model/user/UserDataEmployeModel");
const UserGeographyModel = require("../../model/user/UserGeographyModel");
const DecreesModel = require("../../model/DecreesModel");
const responseHandler = require("../../helpers/responseHandler");

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

const getUserProfile = async (req, res) => {
  try {
    const data = await UsersModel.findOne({
      attributes: { exclude: ["password", "token"] },
      where: { id: req.params.id },
      include: [
        "user_data",
        "user_contact",
        "user_data_employe",
        "user_geography",
        "job_history",
        "certifications",
        "decrees",
      ],
    });

    responseHandler(res, 200, {
      message: "Success get all users",
      data,
    });
  } catch (error) {
    responseHandler(res, 500, {
      message: error.message,
    });
  }
};

module.exports = { getUserProfile };
