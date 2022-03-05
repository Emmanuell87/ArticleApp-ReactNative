import multer from "multer";
import mimeTypes from "mime-types";

const storage = multer.diskStorage({
	// destination(req, file, callback) {
	// 	console.log(file);
	// 	callback(null, "./images");
	// },
	// filename(req, file, callback) {
	// 	console.log(`${file.fieldname}_${Date.now()}_${file.originalname}`);
	// 	callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
	// },
	filename: function (req, file, cb) {
		console.log("aaaa");
		console.log(file);
		const name = file.originalname.split(".");
		cb(
			null,
			Date.now() + name[0] + "." + mimeTypes.extension(file.mimetype)
		);
	},
});

const upload = multer({
	storage: storage,
});

export default upload;
