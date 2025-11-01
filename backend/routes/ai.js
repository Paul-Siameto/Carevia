import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { symptomCheck, nutritionPlan, chatReply, listModels } from "../controllers/aiController.js";

const router = Router();

// Diagnostic route to check available models
router.get("/models", authRequired, listModels);

router.post("/symptom-check", authRequired, symptomCheck);
router.post("/nutrition-plan", authRequired, nutritionPlan);
router.post("/chat", authRequired, chatReply);

export default router;



