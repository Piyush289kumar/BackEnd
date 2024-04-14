import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
const app = express();
const fileLimit = "16kb";
app.use(express.json({ limit: fileLimit }));
app.use(express.urlencoded({ extended: true, limit: fileLimit }));
app.use(express.static("public"));
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

// Import Router
import userRouter from "./routes/users.routes.js";

// Router Declaration
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
	const token = jwt.sign(
		{ data: "foobar" },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "1h" }
	);

	const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
	console.log(decoded); // bar
	console.log(decoded.data); // bar

	res.status(200).json({
		decoded,
	});
});

app.use(cookieParser());
export { app };

