import { HealthEntry } from "../models/HealthEntry.js";

export const listEntries = async (req, res) => {
  try {
    const entries = await HealthEntry.find({ user: req.userId }).sort({ date: -1 }).limit(365);
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEntry = async (req, res) => {
  try {
    const entry = await HealthEntry.create({ ...req.body, user: req.userId });
    res.status(201).json({ entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await HealthEntry.findOneAndUpdate({ _id: id, user: req.userId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ entry: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await HealthEntry.findOneAndDelete({ _id: id, user: req.userId });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

