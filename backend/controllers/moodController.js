import { MoodEntry } from "../models/MoodEntry.js";

export const listMoods = async (req, res) => {
  try {
    const entries = await MoodEntry.find({ user: req.userId }).sort({ date: -1 }).limit(365);
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMood = async (req, res) => {
  try {
    const entry = await MoodEntry.create({ ...req.body, user: req.userId });
    res.status(201).json({ entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    await MoodEntry.findOneAndDelete({ _id: id, user: req.userId });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


