const UsersModel = require("../../model/user/UsersModel");
const UserDataModel = require("../../model/user/UserDataModel");
const UserJobHistoryModel = require("../../model/user/UserJobHistoryModel");
const CertificationsModel = require("../../model/CertificationsModel");
const responseHandler = require("../../helpers/responseHandler");

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

const getUserPortfolio = async (req, res) => {
  try {
    const data = await UsersModel.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: UserDataModel,
          as: "user_info",
        },
        {
          model: CertificationsModel,
          as: "certifications",
        },
        {
          model: UserJobHistoryModel,
          as: "job_history",
        },
        "user_contact",
        "user_geography",
      ],
      attributes: { exclude: ["password", "token"] },
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

module.exports = { getUserPortfolio };
