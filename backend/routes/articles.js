import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { listArticles, createArticle, updateArticle, deleteArticle } from "../controllers/articleController.js";

const router = Router();

router.get("/", listArticles);
router.post("/", authRequired, createArticle);
router.put("/:id", authRequired, updateArticle);
router.delete("/:id", authRequired, deleteArticle);

export default router;

