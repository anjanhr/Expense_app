const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateUser = (request, response, next) => {
  const token = request.header("Authorization").split(" ")[1];
  if (token) {
    try {
      const tokenData = jwt.verify(token, process.env.SECRET_KEY);
      // tokenData now have id, name and role
      User.findById(tokenData._id)
        .then((users) => {
          request.tokenData = users;
          next();
        })
        .catch((error) => {
          response.json(error.message);
        });
    } catch (e) {
      response.json({ error: e.message });
    }
  } else {
    return response.json({ notice: "you need token to access this route" });
  }
};

module.exports = authenticateUser;
