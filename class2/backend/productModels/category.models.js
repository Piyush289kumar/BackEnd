import mongooes from "mongoose";

const categorySchema = new mongooes.Schema(
  {
    categoryName: {
      type: String,
      requried: true,
    },
    createdBy: {
      type: mongooes.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Category = mongooes.model("Category", categorySchema);
