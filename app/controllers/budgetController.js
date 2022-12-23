const Budget = require("../models/budget");

const budgetController = {};

budgetController.list = (request, response) => {
  Budget.find({ user: request.tokenData._id })
    .then((budgets) => {
      response.json(budgets);
    })
    .catch((error) => {
      response.json({ mainError: error.message });
    });
};

budgetController.update = (request, response) => {
  const id = request.params.id;
  const body = request.body;
  Budget.findOneAndUpdate({ _id: id, user: request.tokenData._id }, body, {
    new: true,
    runValidators: true,
  })
    .then((budgets) => {
      response.json(budgets);
    })
    .catch((error) => {
      if (error.message.includes("Number failed")) {
        response.json({ numberError: "Please enter only number" });
      } else {
        response.json({ mainError: error.message });
      }
    });
};

module.exports = budgetController;
