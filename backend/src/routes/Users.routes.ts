import { Router } from "express";
import { signUp, signIn, listUsers } from "../controllers/Users.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signIn", signIn);
router.post("/signUp", signUp);
router.get("/list", verifyToken, listUsers);

export default router;
