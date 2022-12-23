const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    amount: {
      type: Number,
    },
    expenseDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

expenseSchema.plugin(mongoose_delete);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
