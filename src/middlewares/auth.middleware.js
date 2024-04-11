import { ApiError } from "../utils/apiError.utils";
import { asyncHandler } from "../utils/asycHandler.utils";
import jwt from "jsonwebtoken";
import { User } from "../models/users.models";

export const verifyJWT = asyncHandler(async (req, _, next) => {
	try {
		const token =
			req.cookie?.accessToken ||
			req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			throw new ApiError(401, "Unauthorized Request");
		}

		const decodedToken = await jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET
		);

		const user = await User.findById(decodedToken?._id).select(
			"-password -refreshToken"
		);

		if (!user) {
			throw new ApiError(401, "Invalid Access Token");
		}

		req.user = user;
		next();
	} catch (error) {
		throw new ApiError(401, error || "Invalid Access Token");
	}
});
