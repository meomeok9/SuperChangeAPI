const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const mainRoute = require("./Src/Routes/main");
const mongoose = require("mongoose");
const session = require("express-session");
const csurf = require("csurf");
const MongoDBStore = require("connect-mongodb-session")(session);
const PORT = process.env.PORT;
const URI = process.env.MONGODB_URI;

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
};

const app = express();

app.use(cors(corsOpts));
const csurfProtection = csurf();
const store = new MongoDBStore({
  uri: URI,
  collection: "changerSession",
  expires: 24 * 60 * 60 * 1000 * 7,
});
app.set("view engine", "ejs");
app.set("views", "Src/page");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);

app.get("/", (req, res, next) => {
  res.redirect("/add-new-user");
});
app.use(mainRoute);
app.use(csurfProtection);
app.use(helmet());

// app.use(function (req, res, next) {
//   res.locals.user = req.session.user;
//   res.locals.isLoggedIn = req.session.isLoggedIn;
//   next();
// });
mongoose.set("strictQuery", false);

mongoose
  .connect(URI) //
  .then((rs) => {
    app.listen(PORT || 5000, () => {
      console.log(
        `listening on ${
          PORT ? PORT : "5000"
        } and Success to connect to database!`
      );
    });
  })
  .catch((err) => {
    console.error("fail to connect to MongoDB!!");
  });
