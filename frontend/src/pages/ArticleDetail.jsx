import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const baseURL = base.endsWith("/api") ? base : `${base}/api`;
        const api = axios.create({ baseURL });
        const { data } = await api.get(`/articles/${id}`);
        setArticle(data.article);
      } catch (err) {
        setError(err?.response?.data?.message || "Article not found");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="card p-4">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="card p-4 space-y-3">
        <p className="text-sm text-red-600">{error || "Article not found"}</p>
        <button
          className="btn-primary text-sm"
          type="button"
          onClick={() => navigate("/articles")}
        >
          Back to articles
        </button>
      </div>
    );
  }

  const fontFamily = article.bodyFontFamily || "system";
  const fontSize = article.bodyFontSize || "text-base";
  const fontColor = article.bodyFontColor || "text-gray-800";
  const bodyClass = `${fontSize} ${fontColor} whitespace-pre-line ${
    fontFamily === "serif"
      ? "font-serif"
      : fontFamily === "mono"
      ? "font-mono"
      : "font-sans"
  }`;

  const bodyText = article.body || article.content || "";

  return (
    <article className="max-w-3xl mx-auto space-y-4">
      <button
        type="button"
        className="text-sm text-primary hover:underline"
        onClick={() => navigate("/articles")}
      >
         Back to articles
      </button>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {article.imageUrl && (
          <div className="relative h-64 w-full bg-gray-100">
            <img
              src={article.imageUrl}
              alt="Article visual"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        )}
        <div className="p-5 sm:p-6 space-y-4">
          <header className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Health & Wellness
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {article.title}
            </h1>
            <p className="text-xs text-gray-500">
              {new Date(article.createdAt).toLocaleString()}
            </p>
            {article.summary && (
              <p className="text-sm text-gray-700 max-w-2xl">
                {article.summary}
              </p>
            )}
          </header>
          {article.videoUrl && (
            <div className="mt-3 aspect-video w-full">
              <iframe
                src={article.videoUrl}
                title="Article video"
                className="w-full h-full rounded-md border border-gray-200"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {bodyText && <p className={bodyClass}>{bodyText}</p>}
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
