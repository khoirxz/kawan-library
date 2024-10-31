/**
 * Handles the HTTP response by setting the status code and sending a JSON response.
 *
 * @param {Object} res - The response object to send the status and data.
 * @param {number} code - The HTTP status code to be set in the response.
 * @param {string} message - The message to be included in the response.
 * @param {any} data - The data to be included in the response.
 */
module.exports = function responseHandler(
  res,
  code,
  { message = "Operation failed", data = null } = {}
) {
  res
    .status(code)
    .json({ code, status: code >= 400 ? "error" : "success", message, data });
};
