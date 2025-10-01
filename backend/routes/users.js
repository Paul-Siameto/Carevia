import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { updateProfile, deleteAccount } from "../controllers/userController.js";

const router = Router();

router.put("/me", authRequired, updateProfile);
router.delete("/me", authRequired, deleteAccount);

export default router;

