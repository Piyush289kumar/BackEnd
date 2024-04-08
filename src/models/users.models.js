import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: [true, "Username is Required"],
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: [true, "Email is Required"],
			lowercase: true,
			trim: true,
		},
		fullName: {
			type: String,
			required: true,
			trim: true,
		},
		avatar: {
			type: String,
			required: true,
		},
		coverImage: {
			type: String,
			required: true,
		},
		watchHistory: {
			type: Schema.Types.ObjectId,
			ref: "Video",
		},
		password: {
			type: String,
			required: [true, "Password is Required"],
		},
		refreshToken: {
			type: String,
		},
	},
	{ timestamps: true }
);

export const User = model("User", userSchema);
