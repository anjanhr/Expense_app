const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4010;
const router = require("./config/routes");
const connectDB = require("./config/database");
const cors = require("cors");
// const expressfileupload = require("express-fileupload"); // used before aws s3 request only
const bodyParser = require("body-parser");
// const path = require("path");

// myDB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});

app.use(cors());
app.use(express.json());
// app.use(expressfileupload());
app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cyclic connection
// app.use(express.static(path.join(__dirname, "./client/build")));

// app.get("*", function (_, res) {
//   res.sendFile(
//     path.join(__dirname, "./client/build/index.html"),
//     function (err) {
//       res.send(err);
//     }
//   );
// });
