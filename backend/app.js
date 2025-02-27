let express = require("express");
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
const UsersRoute = require("./routes/user/UsersRoute.js");
// routes decrees
const DecreesRoute = require("./routes/decree/DecreesRoute.js");
// routes certifications
const CertificationsRoute = require("./routes/CertificationsRoute.js");
// routes User Data
const UserDataRoute = require("./routes/user/UserDataRoute.js");
// routes User Contact
const UserContact = require("./routes/user/UserContactRoute.js");
// routes User data employe
const UserDataEmployeRoute = require("./routes/user/UserDataEmployeRoute.js");
// routes Geography data
const UserGeographyRoute = require("./routes/user/UserGeographyRoute.js");
// routes job history
const UserJobHistoryRoute = require("./routes/user/UserJobHistoryRoute.js");
// routes decree category
const DecreeCategoryRoute = require("./routes/decree/DecreeCategoryRoute.js");
// routes user portfolio
const UserPortfolioRoute = require("./routes/user/UserPortfolioRoute.js");
// routes user profile
const UserProfileRoute = require("./routes/user/UserProfileRoute.js");

// init express
const app = express();

// intialize middleware
app.use(
  cors({
    credentials: true,
    origin: globals.ORIGIN,
  })
);

app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// access to http://localhost:5000/api.library/uploads/avatars
// access to http://localhost:5000/api.library/uploads/decrees
// access to http://localhost:5000/api.library/uploads/certificates
app.use(`${globals.BASE_URL}/`, express.static("public"));

// validasi Origin Header
app.use((req, res, next) => {
  // define allowed origin
  // config 1
  const allowedOrigin = globals.ORIGIN;
  const origin = req.get("origin"); // req.headers.origin;

  // find match with origin
  if (allowedOrigin.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }

  // config 2
  // with referer
  // const allowedReferers = globals.ORIGIN;
  // const referer = req.headers.referer;

  // if (
  //   !referer ||
  //   !allowedReferers.some((allowedReferer) =>
  //     referer.startsWith(allowedReferer)
  //   )
  // ) {
  //   return res.status(403).json({ error: "Access denied" });
  // }

  next();
});

// routes
app.get(globals.BASE_URL, (req, res) => {
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

app.use(`${globals.BASE_URL}/auth/`, AuthRoute);
// app.use(`/api.library/decree/category/"`, DecreeCategoryRoute);
app.use(`${globals.BASE_URL}/decree/category`, DecreeCategoryRoute);
// routes berasosiasi dengan data user
app.use(`${globals.BASE_URL}/users/`, UsersRoute);
app.use(`${globals.BASE_URL}/decrees/`, DecreesRoute);
app.use(`${globals.BASE_URL}/certifications/`, CertificationsRoute);
app.use(`${globals.BASE_URL}/user/data/`, UserDataRoute);
app.use(`${globals.BASE_URL}/user/contact/`, UserContact);
app.use(`${globals.BASE_URL}/user/data/employe/`, UserDataEmployeRoute);
app.use(`${globals.BASE_URL}/user/geography/`, UserGeographyRoute);
app.use(`${globals.BASE_URL}/user/job/history/`, UserJobHistoryRoute);

app.use(`${globals.BASE_URL}/user/profile/`, UserProfileRoute);
app.use(`${globals.BASE_URL}/user/portfolio/`, UserPortfolioRoute);

// async to db
(() => db.sync())();

app.listen(globals.PORT, () => {
  console.log(
    "Example app listening on port http://localhost:5000/api.library"
  );
});
