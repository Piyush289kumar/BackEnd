import { asyncHandler } from "../utils/asycHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
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
		console.log(username);
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
export { registerUser };
