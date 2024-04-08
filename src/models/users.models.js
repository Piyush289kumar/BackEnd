import mongoose, { Schema, model } from "mongoose";
import { jwt } from "jsonwebtoken";
import { bcrypt } from "bcrypt";
const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: [true, "Username is Required"],
			lowercase: true,
			trim: true,
			index: true,
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
			index: true,
		},
		avatar: {
			type: String,
			required: true,
		},
		coverImage: {
			type: String,
			required: true,
		},
		watchHistory: [
			{
				type: Schema.Types.ObjectId,
				ref: "Video",
			},
		],
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
userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
		next();
	}
	return next();
});
userSchema.method.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = async function () {
	return await jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			fullName: this.fullName,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};
userSchema.method.generateRefreshToken = async function () {
	return await jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

export const User = model("User", userSchema);
