const express = require("express");
const app = express();
const expressfileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const router = require("./config/routes");

require("dotenv").config();
const port = process.env.PORT || 4000;
const cors = require("cors");
const configureDb = require("./config/database");
const path = require("path");

configureDb();

app.use(cors());
app.use(expressfileupload());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
app.use("/uploads", express.static("uploads"));

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.listen(port, () => {
  console.log("database is listening on the port", port);
});

// app.listen(port, () => {
//   console.log("database is listening on the port", port);
// });
