import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;

connectDB()
	.then(() => {
		app.on("error", (error) => {
			console.log(`Error: ${error}`);
			throw error;
		});

		app.listen(PORT || 8000, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.log(`Mongodb Connection Error`, error);
	});
