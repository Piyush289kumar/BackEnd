import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Title Is Required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    subTodo: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subTodo",
      },
    ],
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", TodoSchema);
