const responseHandler = require("./responseHandler");

/**
 * Generic function to check data existence.
 *
 * @param {Object} model - Sequelize model to query.
 * @param {string} field - Field name to check.
 * @param {any} value - Value to match in the field.
 * @param {Object} res - Express response object.
 * @param {boolean} shouldExist - Whether data is expected to exist or not.
 * @returns {Promise<boolean>} - Returns true if the check passes, false otherwise.
 */
const checkData = async (model, field, value, res, shouldExist) => {
  try {
    const data = await model.findAll({
      where: {
        [field]: value,
      },
    });

    const exists = data.length > 0;

    if (shouldExist && !exists) {
      responseHandler(res, 404, { message: "Data not found" });
      return false;
    }

    if (!shouldExist && exists) {
      responseHandler(res, 400, { message: "Data already exist" });
      return false;
    }

    return true; // Validation passed
  } catch (error) {
    responseHandler(res, 500, { message: error.message });
    return false;
  }
};

/**
 * Wrapper for checking if data exists.
 */
const checkDataExist = (model, field, value, res) =>
  checkData(model, field, value, res, true);

/**
 * Wrapper for checking if data does not exist.
 */
const checkDataDontExist = (model, field, value, res) =>
  checkData(model, field, value, res, false);

module.exports = { checkDataExist, checkDataDontExist };
