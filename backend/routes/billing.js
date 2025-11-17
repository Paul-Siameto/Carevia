import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { confirmPaystackPayment } from "../controllers/billingController.js";

const router = Router();

router.post("/paystack/confirm", authRequired, confirmPaystackPayment);

export default router;
