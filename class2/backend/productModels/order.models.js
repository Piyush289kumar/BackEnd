import mongooes from "mongoose";

const orderItemListSchema = mongooes.Schema({
  productId: {
    type: mongooes.Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  qty: {
    type: Number,
    default: 1,
    require: true,
  },
});

const orderSchema = mongooes.Schema(
  {
    orderPrice: {
      type: Number,
      require: true,
    },
    orderAddress: [
      {
        State: { type: String, enum: ["MP", "UP"] },
        Pincode: { type: Number },
        landmark: { type: String },
      },
    ],

    orderItems: [orderItemListSchema],

    orderStatus: {
      type: String,
      enum: ["Pending", "Cancel", "Delivered"],
    },
  },
  { timestamps: true }
);

export const Order = mongooes.model("Order", orderSchema);
