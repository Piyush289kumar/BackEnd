import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
	// cloud_name: process.env.CLOUDINARY_NAME,
	// api_key: process.env.CLOUDINARY_API_KEY,
	// api_secret: process.env.CLOUDINARY_API_SECRET,
	// secure: true,
	cloud_name: "des1uatms",
	api_key: "612657266681866",
	api_secret: "fFghsUAriDMyu70u3S94klLgsqM",
	secure: true,
});


const uploadOnCloudinary = async (localFilePath) => {
	try {
		if (!localFilePath) return null;

		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		});
		// fs.unlinkSync(localFilePath);
		console.log(`cloudinaryResponse: ${response}`);
		return response;
	} catch (error) {
		fs.unlinkSync(localFilePath);
		console.log(error);
		return null;
	}
};

export { uploadOnCloudinary };
