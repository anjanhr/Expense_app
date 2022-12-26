const express = require("express");
const router = express.Router();

const userController = require("../app/controllers/userController");
const authenticateUser = require("../app/middlewares/authentication");
const categoryController = require("../app/controllers/categoryController");
const expenseController = require("../app/controllers/expenseController");
const budgetController = require("../app/controllers/budgetController");

// user

router.post("/api/user/register", userController.register);
router.post("/api/user/login", userController.login);
router.get("/api/user/account", authenticateUser, userController.account);
// router.post("/api/user/account", authenticateUser, userController.create);
router.delete("/api/user/account", authenticateUser, userController.destroy);

// budget

router.get("/api/user/budgets", authenticateUser, budgetController.list);
router.put("/api/user/budgets/:id", authenticateUser, budgetController.update);

// category

router.get("/api/user/categories", authenticateUser, categoryController.list);
router.get(
  "/api/user/categories/splitData",
  authenticateUser,
  categoryController.listCategorySplit
);
router.post(
  "/api/user/categories",
  authenticateUser,
  categoryController.create
);
router.delete(
  "/api/user/categories/:id",
  authenticateUser,
  categoryController.softDelete
);
router.put(
  "/api/user/categories/undodeleted",
  authenticateUser,
  categoryController.undoDeleted
);

// expense

router.get("/api/user/expenses", authenticateUser, expenseController.list);
router.get(
  "/api/user/expenses/total",
  authenticateUser,
  expenseController.listTotalBudgetOverview
);
router.post("/api/user/expenses", authenticateUser, expenseController.create);
router.put(
  "/api/user/expenses/:id",
  authenticateUser,
  expenseController.update
);

router.delete(
  "/api/user/expenses/:id/harddelete",
  authenticateUser,
  expenseController.hardDeleted
);

module.exports = router;
