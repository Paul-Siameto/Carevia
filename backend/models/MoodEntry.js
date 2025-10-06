import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, default: () => new Date(), index: true },
    mood: { type: String, enum: ["very-bad", "bad", "neutral", "good", "very-good"], required: true },
    stressLevel: { type: Number, min: 0, max: 10 },
    notes: String,
  },
  { timestamps: true }
);

export const MoodEntry = mongoose.model("MoodEntry", moodEntrySchema);



