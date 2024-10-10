var express = require("express");
var cors = require("cors");
var dotenv = require("dotenv").config();
var cookieParser = require("cookie-parser");

if (dotenv.error) {
  console.log(dotenv.error);
}

var db = require("./config/database");

// routes auth
var AuthRoute = require("./routes/AuthRoute.js");
// routes users
var UsersRoute = require("./routes/UsersRoute.js");
// routes decrees
var DecreesRoute = require("./routes/DecreesRoute.js");
// routes certifications
var CertificationsRoute = require("./routes/CertificationsRoute.js");

// init express
var app = express();

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
app.use(express.static("public"));

// routes
app.get("/api.library", function (req, res) {
  // check if databse connected
  var status;

  if (db.authenticate()) {
    status = "connected";
  } else {
    status = "failed";
  }

  res.status(200).json({ version: "1.0.0", databse: "mysql", status: status });
});

app.use("/api.library/auth/", AuthRoute);
app.use("/api.library", UsersRoute);
app.use("/api.library/decrees/", DecreesRoute);
app.use("/api.library/certifications/", CertificationsRoute);

// async to db
(function () {
  db.sync();
})();

app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Example app listening on port http://localhost:5000/api.library"
  );
});
