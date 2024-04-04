import mongoose from "mongoose";

const userSchema = new mongooes.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
