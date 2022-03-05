import { v2 as cloudinary } from "cloudinary";
import { config as dotenv } from "dotenv";

dotenv();

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_KEY,
	api_secret: process.env.CLOUD_SECRET,
});

export default cloudinary;

// export type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
