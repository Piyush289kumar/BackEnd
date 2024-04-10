import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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

app.use(cookieParser());
export { app };
