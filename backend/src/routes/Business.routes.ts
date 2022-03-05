import { Router } from "express";
import {
	saveBusiness,
	getAllBusiness,
	getBusiness,
	updateBusiness,
	deleteBusiness,
} from "../controllers/Business.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { getPermissionsParams } from "../services/permisos.services";

const router = Router();

router.post("/business", verifyToken, saveBusiness);
router.get("/business", verifyToken, getAllBusiness);
router.get("/business/:id", verifyToken, getPermissionsParams, getBusiness);
router.put("/business/:id", verifyToken, getPermissionsParams, updateBusiness);
router.delete(
	"/business/:id",
	verifyToken,
	getPermissionsParams,
	deleteBusiness
);

export default router;
