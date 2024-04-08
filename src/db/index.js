import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
let process_env_MONGODB_URI =
	"mongodb+srv://piyushraikwar289:piyush289@cluster0.5lpcsrr.mongodb.net";
const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${process_env_MONGODB_URI}/${DB_NAME}`
		);
		console.log(`MongoDB Connected.. | DB Host : ${connectionInstance}`);
		console.log(
			`connectionInstance.connection.host : ${connectionInstance.connection.host}`
		);
	} catch (error) {
		console.log(`MongoDB Connection Error : ${error}`);
		process.exit(1);
	}
};
export default connectDB;
