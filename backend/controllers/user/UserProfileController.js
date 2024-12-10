const { UsersModel } = require("../../model/index");
const responseHandler = require("../../helpers/responseHandler");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const data = await UsersModel.findOne({
      attributes: { exclude: ["password", "token"] },
      where: { id: userId ? userId : req.decoded.userId },
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
