import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Article = mongoose.model("Article", articleSchema);

