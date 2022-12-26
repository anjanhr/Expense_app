const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./config/routes");

require("dotenv").config();
const port = process.env.PORT || 4000;
const cors = require("cors");
const configureDb = require("./config/database");

configureDb();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

app.listen(port, () => {
  console.log("database is listening on the port", port);
});

module.exports = app;
