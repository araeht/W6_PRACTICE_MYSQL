import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticlesByJournalist, getJournalistById, removeArticle } from "../services/api";

export default function JournalistArticlesPage() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [journalistName, setJournalistName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
    fetchJournalistName();
  }, [id]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticlesByJournalist(id);
      setArticles(data);
    } catch {
      setError("Failed to load journalist's articles.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJournalistName = async () => {
    try {
      const data = await getJournalistById(id);
      setJournalistName(data.name || "Unknown Journalist");
    } catch {
      setJournalistName("Unknown Journalist");
    }
  };

  const handleView = (articleId) => navigate(`/articles/${articleId}`);
  const handleEdit = (articleId) => navigate(`/articles/${articleId}/edit`);

  const handleDelete = async (articleId) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(articleId);
      await fetchArticles();
    } catch {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <h2>Articles by {journalistName}</h2>

      {articles.length === 0 ? (
        <p>No articles found for this journalist.</p>
      ) : (
        <div className="article-list">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-category">
        Categories:{" "}
        {article.categories
          ? article.categories.split(",").map((cat, i) => (
              <span key={i} style={{ marginRight: "5px" }}>
                {cat.trim()}
                {i < article.categories.split(",").length - 1 ? "," : ""}
              </span>
            ))
          : "N/A"}
      </div>

      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button className="button-tertiary" onClick={() => onDelete(article.id)}>
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}
