import { Router } from "express";
import { registerUser } from "../controllers/users.controller.js";

const router = Router();

router.route("/register").get(registerUser);

export default router;