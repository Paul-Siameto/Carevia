import { User } from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, healthProfile } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, healthProfile } },
      { new: true }
    );
    res.json({ user: { id: updated._id, name: updated.name, email: updated.email, healthProfile: updated.healthProfile } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


