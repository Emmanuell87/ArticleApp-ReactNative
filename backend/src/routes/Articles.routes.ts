import { Router } from "express";
import {
	saveArticle,
	deleteArticle,
	getArticle,
	getArticles,
	updateArticle,
	uploadPhoto,
} from "../controllers/Articles.controller";
import upload from "../config/multer.config";
import { verifyToken } from "../middlewares/auth.middleware";
import {
	getPermissionsBody,
	getPermissionsForArticles,
} from "../services/permisos.services";

const router = Router();

router.get("/articles", verifyToken, getPermissionsBody, getArticles);
router.get("/articles/:id", verifyToken, getPermissionsBody, getArticle);
router.post(
	"/articles",
	verifyToken,
	upload.single("photo"),
	getPermissionsBody,
	saveArticle
);
router.put(
	"/articles/:id",
	verifyToken,
	upload.single("photo"),
	getPermissionsForArticles,
	updateArticle
);
router.delete(
	"/articles/:id",
	verifyToken,
	getPermissionsForArticles,
	deleteArticle
);
router.post(
	"/articles/photo",
	verifyToken,
	upload.single("photo"),
	uploadPhoto
);

export default router;
