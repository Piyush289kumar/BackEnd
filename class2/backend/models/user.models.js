import mongooes from "mongoose";

const userSchema = new mongooes.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export const User = mongooes.model("User", userSchema);
