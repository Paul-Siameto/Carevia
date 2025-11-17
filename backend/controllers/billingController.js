import axios from "axios";
import { User } from "../models/User.js";

export const confirmPaystackPayment = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) {
      return res.status(400).json({ message: "Missing Paystack reference" });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res
        .status(500)
        .json({ message: "PAYSTACK_SECRET_KEY is not configured on the server" });
    }

    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const { data } = await axios.get(verifyUrl, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!data.status || data.data.status !== "success") {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        isPremium: true,
        premiumSince: new Date(),
        premiumPlan: "default",
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Payment verified and premium unlocked",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isPremium: user.isPremium,
      },
    });
  } catch (err) {
    console.error("Paystack verification error", err.response?.data || err.message);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};
