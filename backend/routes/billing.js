import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { 
  confirmPaystackPayment,
  initiateMpesaPayment,
  handleMpesaCallback,
  verifyMpesaPayment,
} from "../controllers/billingController.js";

const router = Router();

// Paystack routes
router.post("/paystack/confirm", authRequired, confirmPaystackPayment);

// M-Pesa routes
router.post("/mpesa/initiate", authRequired, initiateMpesaPayment);
router.post("/mpesa/callback", handleMpesaCallback); // No auth required - called by M-Pesa
router.post("/mpesa/verify", authRequired, verifyMpesaPayment);

export default router;
