/**
 * Handles the HTTP response by setting the status code and sending a JSON response.
 *
 * @param {Object} res - The response object to send the status and data.
 * @param {number} code - The HTTP status code to be set in the response.
 * @param {Object} options - The options object containing message, data, and pagination.
 * @param {string} options.message - The message to be included in the response.
 * @param {any} options.data - The data to be included in the response.
 * @param {Object} [options.pagination] - The pagination details, if applicable.
 */
module.exports = function responseHandler(
  res,
  code,
  { message = "Operation failed", data = null, pagination = null } = {}
) {
  const response = {
    code,
    status: code >= 400 ? "error" : "success",
    message,
    data,
  };
  if (pagination) {
    response.pagination = pagination;
  }
  res.status(code).json(response);
};
