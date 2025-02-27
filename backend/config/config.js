/* global process */

const globals = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access_token_secret",
  USER: process.env.USER || "",
  PASSWORD: process.env.PASSWORD || "",
  TABLE: process.env.TABLE || "",
  PORT: process.env.PORT || 5000,
  BASE_URL: process.env.BASE_URL || "",
  ORIGIN: [
    "http://localhost:3000",
    "https://localhost:*",
    "https://bprkawan.co.id/library",
    "https://larekalihgarden.my.id/karyakelola",
  ],
};

module.exports = {
  globals,
};
