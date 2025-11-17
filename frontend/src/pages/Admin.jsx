import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import AdminDashboardLayout from "../components/AdminDashboardLayout.jsx";

const Admin = () => {
  const location = useLocation();
  const path = location.pathname;

  const { token } = useAuth();

  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const baseURL = base.endsWith("/api") ? base : `${base}/api`;
  const api = axios.create({ baseURL });
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const [articleTitle, setArticleTitle] = useState("");
  const [articleSummary, setArticleSummary] = useState("");
  const [articleBody, setArticleBody] = useState("");
  const [articleImage, setArticleImage] = useState("");
  const [articleVideo, setArticleVideo] = useState("");
  const [bodyFontFamily, setBodyFontFamily] = useState("system");
  const [bodyFontSize, setBodyFontSize] = useState("text-sm");
  const [bodyFontColor, setBodyFontColor] = useState("text-gray-700");
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [savingArticle, setSavingArticle] = useState(false);

  let sectionTitle = "Overview";
  let sectionSubtitle = "High-level insight into how Carevia is being used.";

  if (path.startsWith("/admin/users")) {
    sectionTitle = "Users";
    sectionSubtitle = "Monitor signups and active members.";
  } else if (path.startsWith("/admin/content")) {
    sectionTitle = "Content";
    sectionSubtitle = "Create and manage wellness articles.";
  } else if (path.startsWith("/admin/settings")) {
    sectionTitle = "Settings";
    sectionSubtitle = "Fine-tune platform configuration.";
  }

  const isContentPage = path.startsWith("/admin/content");

  const loadArticles = async () => {
    try {
      setLoadingArticles(true);
      const { data } = await api.get("/articles");
      setArticles(data.articles || []);
    } catch {
      // ignore for now
    } finally {
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    if (isContentPage) {
      loadArticles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentPage]);

  const resetForm = () => {
    setArticleTitle("");
    setArticleSummary("");
    setArticleBody("");
    setArticleImage("");
    setArticleVideo("");
    setBodyFontFamily("system");
    setBodyFontSize("text-sm");
    setBodyFontColor("text-gray-700");
    setEditingId(null);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">{sectionTitle}</h1>
          <p className="text-sm text-gray-500">{sectionSubtitle}</p>
        </div>

        {!isContentPage && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]">
                  Active users
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">--</p>
                <p className="mt-1 text-xs text-gray-500">
                  Hook this up to your real metrics later.
                </p>
              </div>
              <div className="card p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]">
                  AI requests today
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">--</p>
                <p className="mt-1 text-xs text-gray-500">
                  Track chat, symptom checks, and nutrition plans.
                </p>
              </div>
              <div className="card p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]">
                  Errors
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">--</p>
                <p className="mt-1 text-xs text-gray-500">
                  Surface backend or AI issues here.
                </p>
              </div>
            </div>

            <div className="card p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Recent activity</h2>
              <p className="text-xs text-gray-500">
                This is a placeholder. You can plug in audit logs or key events here later.
              </p>
            </div>
          </>
        )}

        {isContentPage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-4 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-gray-900">
                  {editingId ? "Edit article" : "Create article"}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:underline"
                    onClick={resetForm}
                  >
                    Clear selection
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Title
                  </label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. Managing blood pressure with lifestyle changes"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Short summary
                  </label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[60px]"
                    placeholder="A quick one or two sentence overview for the article card."
                    value={articleSummary}
                    onChange={(e) => setArticleSummary(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Body
                  </label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[160px]"
                    placeholder="Write the full article content here..."
                    value={articleBody}
                    onChange={(e) => setArticleBody(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Image URL
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="https://... (optional)"
                      value={articleImage}
                      onChange={(e) => setArticleImage(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Video URL (YouTube/embed)
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="https://... (optional)"
                      value={articleVideo}
                      onChange={(e) => setArticleVideo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Font family
                    </label>
                    <select
                      className="w-full border rounded-md px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={bodyFontFamily}
                      onChange={(e) => setBodyFontFamily(e.target.value)}
                    >
                      <option value="system">Default</option>
                      <option value="serif">Serif</option>
                      <option value="mono">Monospace</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Font size
                    </label>
                    <select
                      className="w-full border rounded-md px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={bodyFontSize}
                      onChange={(e) => setBodyFontSize(e.target.value)}
                    >
                      <option value="text-sm">Small</option>
                      <option value="text-base">Normal</option>
                      <option value="text-lg">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Font color
                    </label>
                    <select
                      className="w-full border rounded-md px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={bodyFontColor}
                      onChange={(e) => setBodyFontColor(e.target.value)}
                    >
                      <option value="text-gray-700">Gray</option>
                      <option value="text-slate-900">Dark</option>
                      <option value="text-primary">Primary</option>
                      <option value="text-emerald-700">Green</option>
                      <option value="text-rose-700">Red</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn-primary px-4 py-2 text-sm"
                  disabled={savingArticle}
                  onClick={async () => {
                    if (!articleTitle.trim() && !editingId) {
                      alert("Please add a title before saving.");
                      return;
                    }
                    try {
                      setSavingArticle(true);
                      const payload = {
                        title: articleTitle || "Untitled article",
                        summary: articleSummary,
                        body: articleBody,
                        imageUrl: articleImage,
                        videoUrl: articleVideo,
                        bodyFontFamily,
                        bodyFontSize,
                        bodyFontColor,
                        published: true,
                      };
                      if (editingId) {
                        await api.put(`/articles/${editingId}`, payload);
                      } else {
                        await api.post("/articles", payload);
                      }
                      await loadArticles();
                      alert("Article saved successfully.");
                      resetForm();
                    } catch (err) {
                      alert(
                        err?.response?.data?.message || "Failed to save article."
                      );
                    } finally {
                      setSavingArticle(false);
                    }
                  }}
                >
                  {savingArticle
                    ? "Saving..."
                    : editingId
                    ? "Update article"
                    : "Save article"}
                </button>
              </div>
            </div>

            <div className="card p-4 space-y-3">
              <h2 className="text-sm font-semibold text-gray-900">Preview</h2>
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {articleTitle || "Article title"}
                </h3>
                <p className="text-xs text-gray-500 mb-2">Health & wellness · Draft</p>
                <p className="text-sm text-gray-700 mb-3">
                  {articleSummary || "A short teaser for your article will appear here."}
                </p>
                <div className="h-px bg-gray-200 my-3" />
                {articleImage && (
                  <div className="mb-3">
                    <img
                      src={articleImage}
                      alt="Article visual"
                      className="w-full max-h-64 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                )}
                {articleVideo && (
                  <div className="mb-3 aspect-video w-full">
                    <iframe
                      src={articleVideo}
                      title="Article video"
                      className="w-full h-full rounded-md border border-gray-200"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                <p
                  className={`${bodyFontSize} ${bodyFontColor} whitespace-pre-line ${
                    bodyFontFamily === "serif"
                      ? "font-serif"
                      : bodyFontFamily === "mono"
                      ? "font-mono"
                      : "font-sans"
                  }`}
                >
                  {articleBody || "Start writing your content to see a live preview."}
                </p>
              </div>
            </div>
          </div>
        )}

        {isContentPage && (
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Existing articles</h2>
              {loadingArticles && (
                <span className="text-xs text-gray-500">Loading...</span>
              )}
            </div>
            {articles.length === 0 && !loadingArticles && (
              <p className="text-xs text-gray-500">
                No articles yet. Save one using the form above.
              </p>
            )}
            {articles.length > 0 && (
              <div className="space-y-2">
                {articles.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between gap-3 border rounded-md px-3 py-2 bg-white"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {a.imageUrl && (
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <img
                            src={a.imageUrl}
                            alt="Thumb"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {a.title}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-[11px] text-primary hover:underline"
                        onClick={() => {
                          setEditingId(a._id);
                          setArticleTitle(a.title || "");
                          setArticleSummary(a.summary || "");
                          setArticleBody(a.body || a.content || "");
                          setArticleImage(a.imageUrl || "");
                          setArticleVideo(a.videoUrl || "");
                          setBodyFontFamily(a.bodyFontFamily || "system");
                          setBodyFontSize(a.bodyFontSize || "text-sm");
                          setBodyFontColor(a.bodyFontColor || "text-gray-700");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-[11px] text-red-600 hover:underline"
                        onClick={async () => {
                          if (!window.confirm("Delete this article?")) return;
                          try {
                            await api.delete(`/articles/${a._id}`);
                            if (editingId === a._id) {
                              resetForm();
                            }
                            await loadArticles();
                          } catch (err) {
                            alert(
                              err?.response?.data?.message ||
                                "Failed to delete article."
                            );
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default Admin;
