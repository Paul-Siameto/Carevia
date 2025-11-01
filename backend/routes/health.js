import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { listEntries, createEntry, updateEntry, deleteEntry } from "../controllers/healthController.js";

const router = Router();

router.get("/", authRequired, listEntries);
router.post("/", authRequired, createEntry);
router.put("/:id", authRequired, updateEntry);
router.delete("/:id", authRequired, deleteEntry);

export default router;