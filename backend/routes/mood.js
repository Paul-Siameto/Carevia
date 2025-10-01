import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { listMoods, createMood, deleteMood } from "../controllers/moodController.js";

const router = Router();

router.get("/", authRequired, listMoods);
router.post("/", authRequired, createMood);
router.delete("/:id", authRequired, deleteMood);

export default router;


