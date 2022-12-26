const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;
const router = require("./config/routes");
const configureDb = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");

configureDb();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cyclic connection
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.send(err);
    }
  );
});

// myDB connection
app.listen(port, () => {
  console.log("database is listening on the port", port);
});
