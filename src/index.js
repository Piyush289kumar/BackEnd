import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });

const PORT_1 = process.env.PORT || 3000;
console.log(`PORT : ${PORT_1}`);

connectDB()
	.then(() => {
		app.on("error", (error) => {
			console.log(`Error: ${error}`);
			throw error;
		});
		app.listen(4000, () => {
			console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
		});
	})
	.catch((err) => {
		console.log("MONGO db connection failed !!! ", err);
	});
