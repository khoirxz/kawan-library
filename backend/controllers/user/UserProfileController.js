const { UsersModel } = require("../../model/index");
const responseHandler = require("../../helpers/responseHandler");

const fetch = async (req, res) => {
  try {
    const { id } = req.query;

    const options = {
      attributes: { exclude: ["password", "token"] },
      include: [
        "user_data",
        "user_contact",
        "user_data_employe",
        "user_geography",
        "job_history",
        "certifications",
        "decrees",
      ],
    };

    let data;
    if (req.decoded.role === "admin") {
      data = await UsersModel.findByPk(id ? id : req.decoded.userId, options);
    } else {
      data = await UsersModel.findByPk(req.decoded.userId, options);
    }

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

module.exports = { fetch };
