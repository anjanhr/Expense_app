const Category = require("../models/category");
const Expense = require("../models/expense");
const mongoose = require("mongoose");

const categoryController = {};

categoryController.list = (request, response) => {
  Category.find({ user: request.tokenData._id })
    .populate("user")
    .then((categories) => {
      response.json(categories);
    })
    .catch((error) => {
      response.json({ mainError: error.message });
    });
};

categoryController.listCategorySplit = (request, response) => {
  Category.find({ user: request.tokenData._id }).then((categories) => {
    Expense.find({ user: request.tokenData._id })
      .populate("user")
      .populate("category")
      .then((expenses) => {
        let mainresult = [];
        categories.forEach((categoriesEle) => {
          expenses.forEach((expensesEle) => {
            if (
              String(categoriesEle._id) === String(expensesEle.category._id)
            ) {
              const obj = {};
              obj["name"] = categoriesEle.name;
              obj["amount"] = expensesEle.amount;
              obj["date"] = categoriesEle.createdAt;
              obj["deleted"] = categoriesEle.deleted;
              // obj["date"] = categoriesEle.createdAt.toString().slice(4, 15);

              const isPresentEle = mainresult.find((elements) => {
                return elements.name === categoriesEle.name;
              });

              const presentedEleId = mainresult.findIndex((elements) => {
                return elements.name === categoriesEle.name;
              });

              if (isPresentEle === undefined) {
                mainresult.push(obj);
              } else {
                mainresult.splice(presentedEleId, 1);
                mainresult.splice(presentedEleId, 0, {
                  ...isPresentEle,
                  amount: isPresentEle.amount + expensesEle.amount,
                });
              }
            }
          });
        });
        response.json(mainresult);
      })
      .catch((error) => {
        response.json({ mainError: error.message });
      });
  });
};

categoryController.create = (request, response) => {
  const body = request.body;

  if (isNaN(Number(body.name))) {
    const category = new Category(body);
    category.user = request.tokenData._id;
    category
      .save()
      .then((categories) => {
        response.json(categories);
      })
      .catch((error) => {
        if (error.message.includes("E11000")) {
          return response.json({ duplicateError: "Category already Exists!" });
        } else {
          return response.json({ MainError: error.message });
        }
      });
  } else {
    return response.json({ stringError: "Please enter only string" });
  }
};

categoryController.softDelete = (request, response) => {
  const id = request.params.id;
  var copyCategoryId = mongoose.Types.ObjectId(id);
  Category.deleteById(copyCategoryId).then(() => {
    Expense.delete({ category: copyCategoryId }, copyCategoryId).then(() => {
      Category.find({ deleted: false, user: request.tokenData._id })
        .then((categories) => {
          response.json(categories);
        })
        .catch((error) => {
          response.json({ MainError: error.message });
        });
    });
  });
};

categoryController.undoDeleted = (request, response) => {
  const body = request.body;
  Category.restore({ _id: body.id, user: request.tokenData._id }).then(
    (categories) => {
      Expense.restore({ category: body.id })
        .then(() => {
          response.json(categories);
        })
        .catch((error) => {
          response.json({ mainError: error.message });
        });
    }
  );
};

module.exports = categoryController;
