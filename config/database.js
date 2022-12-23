const mongoose = require("mongoose");
require("dotenv").config();

const configureDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("database is connected");
    })
    .catch(() => {
      console.log("database is not connected");
    });
};

module.exports = configureDb;

// const mongoose = require("mongoose");

// const configureDb = () => {
//   mongoose
//     .connect("mongodb://localhost:27017/expense-app", { autoIndex: true })
//     .then(() => {
//       console.log("database is connected");
//     })
//     .catch(() => {
//       console.log("database is not connected");
//     });
// };

// module.exports = configureDb;
