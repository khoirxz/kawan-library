const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const { globals } = require("./config/config.js");

if (dotenv.error) {
  console.log(dotenv.error);
}

const db = require("./config/database");

// routes auth
const AuthRoute = require("./routes/AuthRoute.js");
// routes users
const UsersRoute = require("./routes/UsersRoute.js");
// routes decrees
const DecreesRoute = require("./routes/DecreesRoute.js");
// routes certifications
const CertificationsRoute = require("./routes/CertificationsRoute.js");
// routes user data
const UserDataRoute = require("./routes/UserDataRoute.js");
// routes job history
const JobHistoryRoute = require("./routes/JobHistoryRoute.js");
// routes decree category
const DecreeCategoryRoute = require("./routes/DecreeCategoryRoute.js");

// init express
const app = express();

// intialize middleware
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://localhost:*",
      "https://bprkawan.co.id/library/",
    ],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// access to http://localhost:5000/api.library/uploads/avatars
// access to http://localhost:5000/api.library/uploads/decrees
// access to http://localhost:5000/api.library/uploads/certificates
app.use("/api.library/", express.static("public"));

// routes
app.get("/api.library", (req, res) => {
  db.authenticate()
    .then(() => {
      res
        .status(200)
        .json({ version: "1.0.0", database: "mysql", status: "connected" });
    })
    .catch(() => {
      res.status(500).json({
        version: "1.0.0",
        database: "mysql",
        status: "failed",
      });
    });
});

app.use("/api.library/auth/", AuthRoute);
app.use("/api.library/users/", UsersRoute);
app.use("/api.library/decrees/", DecreesRoute);
app.use("/api.library/certifications/", CertificationsRoute);
app.use("/api.library/userdata/", UserDataRoute);
app.use("/api.library/jobhistory/", JobHistoryRoute);
app.use("/api.library/decreecategory/", DecreeCategoryRoute);

// async to db
(() => db.sync())();

app.listen(globals.PORT, () => {
  console.log(
    "Example app listening on port http://localhost:5000/api.library"
  );
});
