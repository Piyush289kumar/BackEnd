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

		console.log(
			`process.env.ACCESS_TOKEN_SECRET = ` + process.env.ACCESS_TOKEN_SECRET
		);

		const decodedToken = jwt.verify(token, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJc3N1ZXIgKGlzcykiOiJJc3N1ZXIiLCJTdWJqZWN0IChzdWIpIjoiQUNDRVNTX1RPS0VOX1NFQ1JFVCJ9.ltxpYaK2_Se6ODgjKyL9puhvmjRGsMpB5BBtG6Fs_ro");

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