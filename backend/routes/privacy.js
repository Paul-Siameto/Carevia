import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { exportMyData, deleteMyData } from "../controllers/privacyController.js";

const router = Router();

router.get("/export", authRequired, exportMyData);
router.delete("/delete", authRequired, deleteMyData);

export default router;


