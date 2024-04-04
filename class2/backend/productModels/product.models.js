import mongooes from "mongoose";

const productSchema = new mongooes.Schema(
  {
    productName: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongooes.Schema.Types.ObjectId,
      ref: "Category",
    },
    seller: {
      type: mongooes.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Product = mongooes.model("Product", productSchema);
