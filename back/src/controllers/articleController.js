import * as articleRepository from "../repositories/sqlArticleRepository.js";

// GET /api/articles
export async function getAllArticles(req, res) {
  try {
    const articles = await articleRepository.getArticles();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/:id
export async function getArticleById(req, res) {
  try {
    const article = await articleRepository.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/articles
export async function createArticle(req, res) {
  try {
    const newArticle = await articleRepository.createArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/articles/:id
export async function updateArticle(req, res) {
  try {
    const updatedArticle = await articleRepository.updateArticle(
      req.params.id,
      req.body
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/articles/:id
export async function deleteArticle(req, res) {
  try {
    const deleted = await articleRepository.deleteArticle(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/journalists/:id
export async function getArticlesByJournalistId(req, res) {
  try {
    const articles = await articleRepository.getArticlesByJournalistId(req.params.id);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles by journalist ID:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/categories/:id
export async function getArticlesByCategoryId(req, res) {
  try {
    const articles = await articleRepository.getArticlesByCategoryId(req.params.id);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles by category ID:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/categories
export async function getAllCategories(req, res) {
  try {
    const categories = await articleRepository.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
}
