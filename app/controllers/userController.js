const { pick } = require("lodash");
const User = require("../models/user");
const Budget = require("../models/budget");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {};

userController.register = (request, response) => {
  const body = pick(request.body, ["email", "password"]);
  const user = new User(body);

  bcrypt.genSalt().then((salt) => {
    bcrypt.hash(user.password, salt).then((encrypted) => {
      user.password = encrypted;
      user
        .save()
        .then((users) => {
          const budget = new Budget();
          budget.user = users._id;
          budget.save().then(() => {
            response.json("Thanks for registering");
          });
        })
        .catch((error) => {
          if (error.message.includes("E11000")) {
            response.json({ emailError: "Email already Exists!" });
          } else {
            response.json({ mainError: error.message });
          }
        });
    });
  });
};

userController.login = (request, response) => {
  const body = request.body;

  User.findOne({ email: body.email }).then((users) => {
    if (users) {
      bcrypt.compare(body.password, users.password).then((result) => {
        if (result) {
          const tokenData = {
            _id: users._id,
            email: users.email,
            role: users.role,
          };
          const tokenKey = process.env.SECRET_KEY;
          const token = jwt.sign(tokenData, tokenKey, {
            expiresIn: "2d",
          });
          response.json({
            token: `Bearer ${token}`,
          });
        } else {
          response.json({ mainError: "Invalid Email or Password" });
        }
      });
    } else {
      response.json({ mainError: "Invalid Email or Password" });
    }
  });
};

userController.account = (request, response) => {
  response.json(request.tokenData);
};

userController.create = (request, response) => {
  response.json({
    name: request.body.name,
    occupation: request.body.occupation,
    image: request.files,
  });

  // User.findOneAndUpdate(
  //   { _id: request.tokenData._id },
  //   {
  //     $set: {
  //       "profile.name": name,
  //       "profile.occupation": occupation,
  //       "profile.image": image,
  //     },
  //   },
  //   { new: true, runValidators: true }
  // )
  //   .then((users) => {
  //     response.json(users);
  //   })
  //   .catch((error) => {
  //     if (error.message.includes("shorter")) {
  //       response.json({
  //         lengthError: "Check the min length (name & occupation [min:5])",
  //       });
  //     } else if (error.message.includes("longer")) {
  //       response.json({
  //         lengthError: "Check the max length (name & occupation [max:20])",
  //       });
  //     } else if (error.message.includes("required")) {
  //       response.json({
  //         feildsError: "All feilds are required!",
  //       });
  //     } else {
  //       response.json({
  //         mainError: error.message,
  //       });
  //     }
  //   });
};

userController.destroy = (request, response) => {
  User.findOneAndUpdate(
    { _id: request.tokenData._id },
    { $unset: { "profile.image": 1 } },
    { new: true }
  )
    .then((users) => {
      response.json(users);
    })
    .catch((error) => {
      response.json({ mainError: error.message });
    });
};

module.exports = userController;
