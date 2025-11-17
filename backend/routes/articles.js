import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { listArticles, getArticle, createArticle, updateArticle, deleteArticle } from "../controllers/articleController.js";

const router = Router();

router.get("/", listArticles);
router.get("/:id", getArticle);
router.post("/", authRequired, createArticle);
router.put("/:id", authRequired, updateArticle);
router.delete("/:id", authRequired, deleteArticle);

export default router;



