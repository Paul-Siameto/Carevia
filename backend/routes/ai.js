import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { symptomCheck, nutritionPlan, chatReply } from "../controllers/aiController.js";

const router = Router();

router.post("/symptom-check", authRequired, symptomCheck);
router.post("/nutrition-plan", authRequired, nutritionPlan);
router.post("/chat", authRequired, chatReply);

export default router;



