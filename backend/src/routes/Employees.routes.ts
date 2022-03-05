import { Router } from "express";
import {
	getEmployees,
	getEmployee,
	saveEmployee,
	deleteEmployee,
} from "../controllers/Employees.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/employees", verifyToken, getEmployees);
router.get("/employees/:id", verifyToken, getEmployee);
router.post("/employees/:id", verifyToken, saveEmployee);
router.delete("/employees/:id", verifyToken, deleteEmployee);

export default router;
