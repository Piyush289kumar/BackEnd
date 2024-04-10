import { asyncHandler } from "../utils/asycHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { User } from "../models/users.models.js";
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
			(field) => field?.tirm() === ""
		)
	) {
		throw new ApiError(400, "All Field is required");
	}

	if (User.findOne({ $or: [{ username }, { email }] })) {
		throw new ApiError(
			409,
			"User with email or username is already exited"
		);
	}

	const avatarLocalPath = req.files;

	res.json({
		avatarLocalPath,
	});
});

export { registerUser };
