require("rootpath")();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("middleware/error-handler");

// controller
const authController = require("endpoints/auth/auth.controller");
const accountsController = require("endpoints/accounts/accounts.controller");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// api routes
app.use("/auth", authController);
app.use("/accounts", accountsController);

// swagger docs route
app.use("/api-docs", require("helpers/swagger"));

app.use("/test", (req, res) => {
  res.send("hello test");
});

// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
