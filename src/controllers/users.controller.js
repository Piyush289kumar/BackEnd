import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asycHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
const cookieOption = {
	httpOnly: true,
	secure: true,
};
const generateAccessAndRefreshToken = async (userId) => {
	try {
		const findUserData = await User.findById(userId);
		const accessToken = await findUserData.generateAccessToken();
		const refreshToken = await findUserData.generateRefreshToken();
		findUserData.refreshToken = refreshToken;
		await findUserData.save({ validateBeforeSave: false });
		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(
			500,
			"Something went wrong while generating access and refresh tokens"
		);
	}
};
const registerUser = asyncHandler(async (req, res) => {
	// Get user details from frontend
	// Validation - not Empty
	// Check If user already exists: username, email
	// Check for images, check for avatar
	// Upload them to cloudinary, avatar
	// Create user object - create entry in db
	// Remove password and refresh token field from response
	// Check for user creation
	// Return res
	const { username, fullName, email, password } = req.body;
	if (
		[username, fullName, email, password].some(
			(field) => field?.trim() === ""
		)
	) {
		throw new ApiError(400, "All Field is required");
	}
	const userExited = await User.findOne({ $or: [{ username }, { email }] });
	if (userExited) {
		throw new ApiError(
			409,
			"User with email or username is already exited"
		);
	}
	const avatarLocalPath = await req.files?.avatar[0]?.path;
	let coverImageLocalPath = "";
	let coverImage = "";
	if (
		req.files &&
		Array.isArray(req.files.coverImage) &&
		req.files.coverImage.length > 0
	) {
		coverImageLocalPath = await req.files.coverImage[0].path;
		coverImage = await uploadOnCloudinary(coverImageLocalPath);
	}
	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar file is requied");
	}
	const avatar = await uploadOnCloudinary(avatarLocalPath);
	if (!avatar) {
		throw new ApiError(400, "Avatar file is requied");
	}
	const userCreateQuery = await User.create({
		username: username,
		password: password,
		email: email,
		fullName: fullName,
		avatar: avatar.url,
		coverImage: coverImage.url || "",
	});
	const userCreateQueryRes = await User.findById(userCreateQuery._id).select(
		"-password -refreshToken"
	);
	if (!userCreateQueryRes) {
		throw new ApiError(
			500,
			"Something went wrong while resitering the user"
		);
	}
	return res
		.status(201)
		.json(
			new ApiResponse(
				200,
				userCreateQueryRes,
				"User Registered Successfully"
			)
		);
});
const loginUser = asyncHandler(async (req, res) => {
	try {
		const { email, username, password } = req.body;
		if (!email && !username) {
			throw new ApiError(400, "Email Or Username is Required");
		}
		const user = await User.findOne({
			$or: [{ email }, { username }],
		});
		if (!user) {
			throw new ApiError(404, "Account Not Found..!");
		}
		const isPasswordValid = await user.isPasswordCorrect(password);
		if (!isPasswordValid) {
			throw new ApiError(401, "Invalid User Credentials");
		}
		const { accessToken, refreshToken } =
			await generateAccessAndRefreshToken(user._id);
		const loggedInUser = await User.findById(user._id).select(
			"-password -refreshToken"
		);
		return res
			.status(200)
			.cookie("accessToken", accessToken, cookieOption)
			.cookie("refreshToken", refreshToken, cookieOption)
			.json(
				new ApiResponse(
					200,
					{
						user: loggedInUser,
						accessToken,
						refreshToken,
					},
					"User Logged In Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(500, "Something wrong while login account.");
	}
});
const logoutUser = asyncHandler(async (req, res) => {
	try {
		await User.findByIdAndUpdate(
			req.user._id,
			{
				$unset: {
					refreshToken: "1",
				},
			},
			{ new: true }
		);
		return res
			.status(200)
			.clearCookie("accessToken", cookieOption)
			.clearCookie("refreshToken", cookieOption)
			.json(new ApiResponse(200, {}, "User Logged Out"));
	} catch (error) {
		throw new ApiError(500, "Something wrong while logout account");
	}
});
const renewRefreshToken = asyncHandler(async (req, res) => {
	try {
		const incomingRefreshToken =
			req.cookies?.refreshToken || req.body.refreshToken;
		if (!incomingRefreshToken) {
			throw new ApiError(401, "Unauthorized Request");
		}
		const decodedToken = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);
		if (!decodedToken) {
			throw new ApiError(401, "Unable to decode Refresh Token");
		}
		const user = await User.findById(decodedToken?._id);
		if (!user) {
			throw new ApiError(401, "Unable to get user data");
		}
		if (incomingRefreshToken !== user?.refreshToken) {
			throw new ApiError(401, "Refresh token is Expired or Used");
		}
		const { accessToken, newRefreshToken } =
			await generateAccessAndRefreshToken(user?._id);
		return res
			.status(200)
			.cookie("accessToken", accessToken, cookieOption)
			.cookie("refreshToken", newRefreshToken, cookieOption)
			.json(
				new ApiResponse(
					200,
					{
						accessToken: accessToken,
						refreshToken: newRefreshToken,
					},
					"Access Token Renewed"
				)
			);
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid Access Token");
	}
});
const updateCurrentUserPassword = asyncHandler(async (req, res) => {
	const { oldPassword, newPassword, confPassword } = req.body;
	if (oldPassword && newPassword && confPassword) {
		throw new ApiError(400, "All fields are required");
	}
	if (newPassword !== confPassword) {
		throw new ApiError(401, "Password Mismatch");
	}
	try {
		const user = await User.findById(req.user?._id);
		if (!user) {
			throw new ApiError(401, "Can't Get User Data");
		}
		const isPasswordValid = await user.isPasswordCorrect(newPassword);
		if (!isPasswordValid) {
			throw new ApiError(400, "Invalid old Password");
		}
		user.password = newPassword;
		await user.save({ validateBeforeSave: false });
		return res
			.status(200)
			.json(new ApiResponse(200, {}, "User Password is Updated"));
	} catch (error) {
		throw new ApiError(
			401,
			error?.message || "Error While Update User Password"
		);
	}
});

const getCurrentUser = asyncHandler(async (req, res) => {
	return res
		.status(200)
		.json(new ApiResponse(200, req.user, "User Fetch Successfully"));
});

const updateCurrentUserAccountDetails = asyncHandler(async (req, res) => {
	const { fullName, email, username } = req.body;

	if (!fullName && !email && !username) {
		throw new ApiError(400, "Please Give Full Name Or Email Or Username");
	}
	try {
		const user = await findByIdAndUpdate(
			req.user?._id,
			{
				$set: {
					fullName,
					email,
					username,
				},
			},
			{
				new: true,
			}
		).select("-password -refreshToken");

		if (!user) {
			throw new ApiError(
				401,
				"Can't Get User Details and Unable to Update Data "
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					user,
					"Account Detail Updated Successfully"
				)
			);
	} catch (error) {
		throw new ApiError(
			400,
			error?.message || "Something Wrong while User Data Update."
		);
	}
});

export {
	registerUser,
	loginUser,
	logoutUser,
	renewRefreshToken,
	updateCurrentUserPassword,
	getCurrentUser,
};
