import mongoose from "mongoose";

const healthEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, default: () => new Date(), index: true },
    weightKg: Number,
    bloodPressureSystolic: Number,
    bloodPressureDiastolic: Number,
    bloodSugarMgDl: Number,
    exerciseMinutes: Number,
    notes: String,
  },
  { timestamps: true }
);

export const HealthEntry = mongoose.model("HealthEntry", healthEntrySchema);


