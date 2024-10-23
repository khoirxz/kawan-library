/* global process */

var globals = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access_token_secret",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret",
  USER: process.env.USER || "",
  PASSWORD: process.env.PASSWORD || "",
  TABLE: process.env.TABLE || "",
  PORT: process.env.PORT || 5000,
};

module.exports = {
  globals,
};
