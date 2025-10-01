import { HealthEntry } from "../models/HealthEntry.js";
import { MoodEntry } from "../models/MoodEntry.js";
import { Article } from "../models/Article.js";
import { User } from "../models/User.js";

export const exportMyData = async (req, res) => {
  try {
    const [user, health, mood, articles] = await Promise.all([
      User.findById(req.userId),
      HealthEntry.find({ user: req.userId }),
      MoodEntry.find({ user: req.userId }),
      Article.find({ author: req.userId }),
    ]);
    const payload = { user, health, mood, articles, exportedAt: new Date().toISOString() };
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=carevia-export.json");
    res.send(JSON.stringify(payload, null, 2));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMyData = async (req, res) => {
  try {
    await Promise.all([
      HealthEntry.deleteMany({ user: req.userId }),
      MoodEntry.deleteMany({ user: req.userId }),
      Article.deleteMany({ author: req.userId }),
    ]);
    res.json({ message: "Personal data deleted (account not deleted)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


