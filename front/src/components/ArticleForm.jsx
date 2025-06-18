import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById, createArticle, updateArticle } from "../services/api";

export default function ArticleForm({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    journalistId: "",
    categoryIds: "", // comma-separated string like "1,2,3"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && id) {
      fetchArticle(id);
    }
  }, []);

  const fetchArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      const article = await getArticleById(id);
      setFormData({
        title: article.title,
        content: article.content,
        journalistId: article.journalistId,
        categoryIds: article.categories
          ? article.categories
              .split(",")
              .map((name) => name.trim())
              .map((_, idx) => idx + 1)
              .join(",")
          : "",
      });
    } catch (err) {
      setError("Failed to load article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const articleData = {
        ...formData,
        journalistId: Number(formData.journalistId),
        categoryIds: formData.categoryIds
          .split(",")
          .map((id) => Number(id.trim())),
      };

      if (isEdit) {
        await updateArticle(id, articleData);
      } else {
        await createArticle(articleData);
      }

      navigate("/articles");
    } catch (err) {
      console.log(err);
      setError("Failed to submit article.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="article-form" onSubmit={handleSubmit}>
        <h2>{isEdit ? "Edit Article" : "Create Article"}</h2>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <br />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          required
        />
        <br />
        <input
          name="journalistId"
          value={formData.journalistId}
          onChange={handleChange}
          placeholder="Journalist ID"
          required
        />
        <br />
        <input
          name="categoryIds"
          value={formData.categoryIds}
          onChange={handleChange}
          placeholder="Category IDs (comma-separated)"
          required
        />
        <br />
        <button className="main" type="submit">
          {isEdit ? "Edit" : "Create"}
        </button>
      </form>
    </>
  );
}
