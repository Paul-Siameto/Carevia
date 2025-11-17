import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const healthProfileSchema = new mongoose.Schema(
  {
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    heightCm: Number,
    weightKg: Number,
    bloodType: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    healthProfile: healthProfileSchema,
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model("User", userSchema);



