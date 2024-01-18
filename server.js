const express = require("express");
const session = require("express-session");
const Sequelize = require("sequelize");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const allRoutes = require("./controllers");
const exphbs = require("express-handlebars");
const sequelize = require("./config/connection");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.body && req.body._method === "PUT") {
    req.method = "PUT";
  }

  if (req.body && req.body._method === "DELETE") {
    req.method = "DELETE";
    req.url = req.path;
    console.log("req.url", req.url);
    console.log("req.path", req.path);
  }
  next();
});

app.use(express.static("public"));
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

const authMiddleware = (req, res, next) => {
  res.locals.isAuthenticated = req.session.userId ? true : false;
  next();
};

const sessionExpiredMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ sessionExpired: true });
  }
  next();
};

app.use(
  session({
    secret: "secret",
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(authMiddleware);
app.use("/auth/expired", sessionExpiredMiddleware);
app.use(allRoutes);

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, function () {
      console.log("App listening on PORT " + PORT);
    });
  })
  .catch(function (error) {
    console.error("An error occurred while syncing the database:", error);
  });
