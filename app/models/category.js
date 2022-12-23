const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.plugin(mongoose_delete);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
