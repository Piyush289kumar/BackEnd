import { ApiError } from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asycHandler.utils.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
	try {
		const token =
			req.cookies?.accessToken ||
			req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			throw new ApiError(401, "Unauthorized Request");
		}
		const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findById(decodedToken?._id).select("-password");
		if (!user) {
			throw new ApiError(401, "Invalid Access Token");
		}
		req.user = user;
		next();
	} catch (error) {
		throw new ApiError(401, error || "Invalid Access Token");
	}
});
