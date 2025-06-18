import { pool } from "../utils/database.js";

// Get all articles with journalist and multiple categories
export async function getArticles() {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.title, a.content, j.id AS journalistId,
      j.name AS journalist, GROUP_CONCAT(c.name) AS categories FROM articles a
      JOIN journalist j ON a.journalistId = j.id
      LEFT JOIN article_category ac ON a.id = ac.article_id
      LEFT JOIN category c ON ac.category_id = c.id
      GROUP BY a.id
    `);
    return rows;
  } catch (err) {
    console.log("Error fetching articles", err);
  }
}

// Get one article by ID with categories
export async function getArticleById(id) {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.title, a.content,j.id AS journalistId,
      j.name AS journalist,GROUP_CONCAT(c.name) AS categories FROM articles a
      JOIN journalist j ON a.journalistId = j.id
      LEFT JOIN article_category ac ON a.id = ac.article_id
      LEFT JOIN category c ON ac.category_id = c.id
      WHERE a.id = ? GROUP BY a.id
    `, [id]);
    return rows[0] || null;
  } catch (err) {
    console.log("Error fetching article by ID", err);
  }
}

// Create a new article with categories
export async function createArticle(article) {
  const conn = await pool.getConnection();
  try {
    const { title, content, journalistId, categoryIds } = article;
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO articles (title, content, journalistId) VALUES (?, ?, ?)",
      [title, content, journalistId]
    );

    const articleId = result.insertId;

    if (categoryIds?.length) {
      for (const categoryId of categoryIds) {
        await conn.query(
          "INSERT INTO article_category (article_id, category_id) VALUES (?, ?)",
          [articleId, categoryId]
        );
      }
    }

    await conn.commit();
    return { id: articleId, ...article };
  } catch (err) {
    await conn.rollback();
    console.log("Error creating article", err);
  } finally {
    conn.release();
  }
}

// Update article and categories
export async function updateArticle(id, updatedData) {
  const conn = await pool.getConnection();
  try {
    const { title, content, journalistId, categoryIds } = updatedData;
    await conn.beginTransaction();

    await conn.query(
      "UPDATE articles SET title = ?, content = ?, journalistId = ? WHERE id = ?",
      [title, content, journalistId, id]
    );

    await conn.query("DELETE FROM article_category WHERE article_id = ?", [id]);

    if (categoryIds?.length) {
      for (const categoryId of categoryIds) {
        await conn.query(
          "INSERT INTO article_category (article_id, category_id) VALUES (?, ?)",
          [id, categoryId]
        );
      }
    }

    await conn.commit();
    return { id, ...updatedData };
  } catch (err) {
    await conn.rollback();
    console.log("Error updating article", err);
  } finally {
    conn.release();
  }
}

// Delete an article by ID
export async function deleteArticle(id) {
  try {
    const [result] = await pool.query("DELETE FROM articles WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log("Error deleting article", err);
  }
}

// Get articles by journalistId
export async function getArticlesByJournalistId(journalistId) {
  try {
    const [rows] = await pool.query(`
      SELECT a.id,a.title,a.content,j.id AS journalistId,j.name AS journalist,
      GROUP_CONCAT(c.name) AS categories  FROM articles a
      JOIN journalist j ON a.journalistId = j.id
      LEFT JOIN article_category ac ON a.id = ac.article_id
      LEFT JOIN category c ON ac.category_id = c.id
      WHERE j.id = ? GROUP BY a.id
    `, [journalistId]);
    return rows;
  } catch (err) {
    console.log("Error fetching articles by journalist ID", err);
  }
}

// Get articles by categoryId
export async function getArticlesByCategoryId(categoryId) {
  try {
    const [rows] = await pool.query(`
      SELECT  a.id, a.title, a.content, j.id AS journalistId, j.name AS journalist,
      GROUP_CONCAT(c.name) AS categories FROM articles a
      JOIN journalist j ON a.journalistId = j.id
      JOIN article_category ac ON a.id = ac.article_id
      JOIN category c ON ac.category_id = c.id
      WHERE c.id = ? GROUP BY a.id
    `, [categoryId]);
    return rows;
  } catch (err) {
    console.log("Error fetching articles by category ID", err);
  }
}

// Get all categories
export async function getAllCategories() {
  try {
    const [rows] = await pool.query("SELECT id, name FROM category");
    return rows;
  } catch (err) {
    console.log("Error fetching categories", err);
  }
}
