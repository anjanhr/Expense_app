const { pick } = require("lodash");
const User = require("../models/user");
const Budget = require("../models/budget");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const S3_ACCESS_KEY_ID = "AKIAUVKMMK3W24WBYYKN";
const S3_SECRET_ACCESS_KEY = "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";
const S3_BUCKET_REGION = "ap-south-1";
const S3_BUCKET_NAME = "new-expense-profile";

const userController = {};

const s3 = new S3Client({
  region: S3_BUCKET_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: S3_BUCKET_REGION,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `image-${Date.now()}.jpeg`);
      },
    }),
  });

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
  // this is the main req, res
  const uploadSingle = upload(S3_BUCKET_NAME).single("image");

  uploadSingle(request, response, (error) => {
    // this req, res are refering the same of above req, res
    if (error) {
      response.json({ amazonS3Error: error.message });
    } else {
      const name = request.body.name;
      const occupation = request.body.occupation;
      const profileUrl = request.file.location && request.file.location;

      User.findOneAndUpdate(
        { _id: request.tokenData._id },
        {
          $set: {
            "profile.name": name,
            "profile.occupation": occupation,
            "profile.image": profileUrl,
          },
        },
        { new: true, runValidators: true }
      )
        .then((users) => {
          response.json(users);
        })
        .catch((error) => {
          if (error.message.includes("shorter")) {
            response.json({
              lengthError: "Check the min length (name & occupation [min:5])",
            });
          } else if (error.message.includes("longer")) {
            response.json({
              lengthError: "Check the max length (name & occupation [max:20])",
            });
          } else {
            response.json({
              mainError: error.message,
            });
          }
        });
    }
  });
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
