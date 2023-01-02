const Expense = require("../models/expense");
const Category = require("../models/category");
const Budget = require("../models/budget");
const bcrypt = require("bcryptjs");

const expenseController = {};

expenseController.list = (request, response) => {
  Expense.find({ user: request.tokenData._id })
    .populate("category")
    .populate("user")
    .then((expenses) => {
      response.json(expenses);
    })
    .catch((error) => {
      response.json({ mainError: error.message });
    });
};

expenseController.listTotalBudgetOverview = (request, response) => {
  Expense.find({ user: request.tokenData._id }).then((expenses) => {
    let totalExpense = 0;
    expenses.forEach((ele) => {
      totalExpense = totalExpense + ele.amount;
    });
    Budget.find({ user: request.tokenData })
      .then((budgets) => {
        const totalBudget = budgets[0].amount;
        const overAll = Math.round((totalExpense / totalBudget) * 100);
        response.json({ overAll: overAll, totalExpense: totalExpense });
      })
      .catch((error) => {
        response.json({ mainError: error.message });
      });
  });
};

expenseController.create = (request, response) => {
  const body = request.body;
  const categoryId = body.category;
  Category.findById(categoryId).then((categories) => {
    if (categories.deleted === true) {
      body.deleted = true;
      const expense = new Expense(body);
      expense.user = request.tokenData._id;
      expense
        .save()
        .then((expenses) => {
          response.json(expenses);
        })
        .catch((error) => {
          if (error.message.includes("E11000")) {
            return response.json({ expenseError: "Expense already Exists!" });
          } else {
            return response.json({ mainError: error.message });
          }
        });
    } else {
      const expense = new Expense(body);
      expense.user = request.tokenData._id;
      expense
        .save()
        .then((expenses) => {
          response.json(expenses);
        })
        .catch((error) => {
          if (error.message.includes("E11000")) {
            return response.json({ expenseError: "Expense already Exists!" });
          } else {
            return response.json({ mainError: error.message });
          }
        });
    }
  });
};

expenseController.update = (request, response) => {
  const id = request.params.id;
  const body = request.body;
  Expense.findOneAndUpdate({ _id: id, user: request.tokenData._id }, body, {
    new: true,
    runValidators: true,
  })
    .then((expenses) => {
      const categoryId = expenses.category.toString();
      Category.findOne({ _id: categoryId, user: request.tokenData._id }).then(
        (categories) => {
          const boolUpdate = {
            deleted: categories.deleted,
          };
          Expense.findOneAndUpdate(
            { _id: id, user: request.tokenData._id },
            boolUpdate,
            {
              new: true,
              runValidators: true,
            }
          )
            .then((expenses) => {
              response.json(expenses);
            })
            .catch((error) => {
              response.json({ mainError: error.message });
            });
        }
      );
    })
    .catch((error) => {
      if (error.message.includes("E11000")) {
        return response.json({ expenseError: "Expense already Exists!" });
      } else {
        return response.json({ mainError: error.message });
      }
    });
};

expenseController.hardDeleted = (request, response) => {
  const id = request.params.id;
  const promptInput = request.body.promptInput;
  const password = request.tokenData.password;

  bcrypt.compare(promptInput, password).then((result) => {
    if (result) {
      Expense.findOneAndDelete({ _id: id, user: request.tokenData._id })
        .then((expenses) => {
          response.json(expenses);
        })
        .catch((error) => {
          response.json({ mainError: error.message });
        });
    } else {
      return response.json({ passwordError: " Incorrect Password" });
    }
  });
};

module.exports = expenseController;
