import { Article } from "../models/Article.js";

export const listArticles = async (req, res) => {
  try {
    const q = req.query.q ? { title: { $regex: req.query.q, $options: "i" } } : {};
    const articles = await Article.find(q).sort({ createdAt: -1 });
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const article = await Article.create({ ...req.body, author: req.userId });
    res.status(201).json({ article });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Article.findOneAndUpdate({ _id: id, author: req.userId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ article: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await Article.findOneAndDelete({ _id: id, author: req.userId });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

