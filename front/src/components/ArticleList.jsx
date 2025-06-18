import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getArticles, removeArticle } from "../services/api";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // default "all"
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles(selectedCategory);
  }, [articles, selectedCategory]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticles();
      setArticles(data);

      // Extract unique categories from all articles
      const allCategories = data.flatMap((article) =>
        article.categories.split(",").map((c) => c.trim())
      );
      const uniqueCategories = [...new Set(allCategories)];
      setCategories(uniqueCategories);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterArticles = (category) => {
    if (category === "all") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter((article) =>
        article.categories
          .split(",")
          .map((c) => c.trim())
          .includes(category)
      );
      setFilteredArticles(filtered);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(id);
      await fetchArticles();
      setSelectedCategory("all"); // reset to all after delete
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);

  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Filter UI */}
      <div className="filterCategory" style={{ marginBottom: "1rem" }}>
        <label htmlFor="categoryFilter">
          <strong>Filter by Categories:</strong>
        </label>
        <select
          className="selectcategoy"
          id="categoryFilter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="article-list">
        {filteredArticles.length === 0 ? (
          <p>No articles found for selected category.</p>
        ) : (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={deleteArticle}
            />
          ))
        )}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author">
        By{" "}
        <Link to={`/journalists/${article.journalistId}/articles`}>
          {article.journalist}
        </Link>
      </div>

      <div className="article-category">
        {article.categories.split(",").map((cat, i) => (
          <span key={i} className="category-box" style={{ marginRight: "0.5rem" }}>
            {cat.trim()}
          </span>
        ))}
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
