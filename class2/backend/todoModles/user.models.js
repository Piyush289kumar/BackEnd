import mongooes from "mongoose";

const userSchema = new mongooes.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: [true, "Password is Required"],
    },
  },
  { timestamps: true }
);

export const User = mongooes.model("User", userSchema);
