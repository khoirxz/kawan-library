const { OfficeModel } = require("../model/index");
const responseHandler = require("../helpers/responseHandler");
const {
  checkDataExist,
  checkDataDontExist,
} = require("../helpers/checkHandler");

const fetch = async (req, res) => {
  try {
    const data = await OfficeModel.findAll();

    responseHandler(res, 200, {
      message: "Success get all offices",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const show = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await OfficeModel.findOne({
      where: {
        id: id,
      },
    });

    responseHandler(res, 200, {
      message: "Success get office",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const create = async (req, res) => {
  const { title, description, address } = req.body;

  try {
    // check data if exist
    await checkDataExist(OfficeModel, "title", title, res);

    const data = await OfficeModel.create({
      title: title,
      description: description,
      address: address,
    });

    return responseHandler(res, 200, {
      message: "Success create office",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  const { title, description, address } = req.body;

  try {
    await checkDataDontExist(OfficeModel, "id", id, res);

    const oldData = await OfficeModel.findOne({
      where: { id: id },
    });

    if (oldData.title == title && oldData.id != id) {
      return responseHandler(res, 400, {
        message: "Office title already exist",
      });
    }

    const data = await OfficeModel.update(
      {
        title: title,
        description: description,
        address: address,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return responseHandler(res, 200, {
      message: "Success update office",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

const destroy = async (req, res) => {
  const id = req.params.id;

  try {
    await checkDataDontExist(OfficeModel, "id", id, res);

    const data = await OfficeModel.destroy({
      where: {
        id: id,
      },
    });

    return responseHandler(res, 200, {
      message: "Success delete office",
      data: data,
    });
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
  }
};

module.exports = { fetch, show, create, update, destroy };
