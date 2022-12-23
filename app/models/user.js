const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    profile: {
      name: {
        type: String,
        minlength: 5,
        maxlength: 20,
      },
      occupation: {
        type: String,
        minlength: 5,
        maxlength: 20,
      },
      image: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
