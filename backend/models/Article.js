import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // legacy content field (kept for backwards compatibility)
    content: { type: String },
    // new structured fields for admin-created posts
    summary: { type: String },
    body: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
    bodyFontFamily: { type: String, default: "system" },
    bodyFontSize: { type: String, default: "text-sm" },
    bodyFontColor: { type: String, default: "text-gray-700" },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Article = mongoose.model("Article", articleSchema);



