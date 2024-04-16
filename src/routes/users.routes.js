import { Router } from "express";
import {
	loginUser,
	logoutUser,
	registerUser,
	renewRefreshToken,
	updateCurrentUserAccountDetails,
	updateCurrentUserAvatar,
	updateCurrentUserPassword,
	updateCurrentUserCoverImage,
	getUserChannelProfile,
	getUserWatchHistory,
} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
	upload.fields([
		{ name: "avatar", maxCount: 1 },
		{ name: "coverImage", maxCount: 1 },
	]),
	registerUser
);
// Secure
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/renew-token").post(renewRefreshToken);
router.route("/change-password").post(verifyJWT, updateCurrentUserPassword);
router
	.route("/update-account")
	.patch(verifyJWT, updateCurrentUserAccountDetails);
router
	.route("/avatar")
	.patch(verifyJWT, upload.single("avatar"), updateCurrentUserAvatar);
router
	.route("/coverImage")
	.patch(verifyJWT, upload.single("coverImage"), updateCurrentUserCoverImage);
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getUserWatchHistory);
export default router;
