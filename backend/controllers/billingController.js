import axios from "axios";
import crypto from "crypto";
import { User } from "../models/User.js";

// In-memory store for M-Pesa payment tracking
// In production, use Redis or database
const mpesaPaymentStore = new Map();

// Helper function to get M-Pesa access token
const getMpesaAccessToken = async () => {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const authUrl = process.env.MPESA_AUTH_URL || "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    if (!consumerKey || !consumerSecret) {
      throw new Error("M-Pesa credentials not configured");
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const response = await axios.get(authUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("M-Pesa access token error:", error.response?.data || error.message);
    throw error;
  }
};

// Initiate M-Pesa STK Push
export const initiateMpesaPayment = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const amount = 22; // KES 5000

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Validate phone number format (should be 254XXXXXXXXX)
    const formattedPhone = phoneNumber.replace(/^0/, "254").replace(/[^0-9]/g, "");
    if (formattedPhone.length !== 12 || !formattedPhone.startsWith("254")) {
      return res.status(400).json({ 
        message: "Invalid phone number format. Use format: 254XXXXXXXXX or 0XXXXXXXXX" 
      });
    }

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL || `${process.env.CLIENT_URL || "http://localhost:5000"}/api/billing/mpesa/callback`;
    const stkPushUrl = process.env.MPESA_STK_PUSH_URL || "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    if (!shortcode || !passkey) {
      return res.status(500).json({ 
        message: "M-Pesa credentials (shortcode, passkey) are not configured on the server" 
      });
    }

    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // Get access token
    const accessToken = await getMpesaAccessToken();

    // Prepare STK push request
    const stkPushRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: `CAREVIA-${req.userId}`,
      TransactionDesc: "Premium subscription payment",
    };

    const response = await axios.post(stkPushUrl, stkPushRequest, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.ResponseCode === "0") {
      // Store mapping for callback
      mpesaPaymentStore.set(response.data.CheckoutRequestID, {
        userId: req.userId,
        phoneNumber: formattedPhone,
        amount,
        timestamp: new Date(),
      });

      return res.json({
        message: "M-Pesa payment request sent. Please check your phone and enter your M-Pesa PIN.",
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
      });
    } else {
      return res.status(400).json({
        message: response.data.ResponseDescription || "Failed to initiate M-Pesa payment",
      });
    }
  } catch (err) {
    console.error("M-Pesa STK push error:", err.response?.data || err.message);
    return res.status(500).json({
      message: err.response?.data?.errorMessage || "Failed to initiate M-Pesa payment",
    });
  }
};

// Handle M-Pesa callback
export const handleMpesaCallback = async (req, res) => {
  try {
    // M-Pesa sends callback data in req.body
    const callbackData = req.body;

    // Send immediate response to M-Pesa (required)
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });

    // Process callback asynchronously
    if (callbackData.Body?.stkCallback) {
      const stkCallback = callbackData.Body.stkCallback;
      const resultCode = stkCallback.ResultCode;
      const checkoutRequestID = stkCallback.CheckoutRequestID;

      if (resultCode === 0) {
        // Payment successful
        const callbackMetadata = stkCallback.CallbackMetadata;
        const items = callbackMetadata?.Item || [];
        
        let amount = null;
        let receiptNumber = null;
        let phoneNumber = null;

        items.forEach((item) => {
          if (item.Name === "Amount") amount = item.Value;
          if (item.Name === "MpesaReceiptNumber") receiptNumber = item.Value;
          if (item.Name === "PhoneNumber") phoneNumber = item.Value;
        });

        // Get user ID from stored mapping
        const paymentData = mpesaPaymentStore.get(checkoutRequestID);
        
        if (paymentData) {
          const user = await User.findByIdAndUpdate(
            paymentData.userId,
            {
              isPremium: true,
              premiumSince: new Date(),
              premiumPlan: "default",
            },
            { new: true }
          );

          if (user) {
            console.log("M-Pesa payment successful - Premium unlocked:", {
              userId: user._id,
              receiptNumber,
              amount,
              phoneNumber,
              checkoutRequestID,
            });
          }

          // Remove from store after processing
          mpesaPaymentStore.delete(checkoutRequestID);
        } else {
          console.log("M-Pesa payment successful but user mapping not found:", {
            receiptNumber,
            amount,
            phoneNumber,
            checkoutRequestID,
          });
        }
      } else {
        console.log("M-Pesa payment failed:", stkCallback.ResultDesc);
      }
    }
  } catch (err) {
    console.error("M-Pesa callback error:", err);
    // Still return success to M-Pesa
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
};

// Verify M-Pesa payment status
export const verifyMpesaPayment = async (req, res) => {
  try {
    const { checkoutRequestID } = req.body;

    if (!checkoutRequestID) {
      return res.status(400).json({ message: "Checkout request ID is required" });
    }

    // Check if user is already premium (payment might have been processed via callback)
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isPremium) {
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
    }

    // If not premium yet, check if payment data exists in store
    const paymentData = mpesaPaymentStore.get(checkoutRequestID);
    
    if (paymentData && paymentData.userId.toString() === req.userId) {
      // Payment is still pending, return pending status
      return res.json({
        message: "Payment is being processed. Please wait...",
        pending: true,
      });
    }

    // Payment not found or already processed
    return res.status(404).json({ 
      message: "Payment not found or already processed" 
    });
  } catch (err) {
    console.error("M-Pesa verification error:", err);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};

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
