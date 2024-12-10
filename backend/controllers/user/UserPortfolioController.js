const { UsersModel } = require("../../model/index");
const responseHandler = require("../../helpers/responseHandler");

const getUserPortfolio = async (req, res) => {
  try {
    const data = await UsersModel.findOne({
      where: { id: req.params.id },
      include: [
        "user_info",
        "certifications",
        "job_history",
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
