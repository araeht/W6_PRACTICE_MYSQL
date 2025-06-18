//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//

import { pool } from '../utils/database.js';

// Get all articles
export async function getArticles() {
    const [rows] = await pool.query('SELECT * FROM articles');
    return rows;
}

// Get one article by ID
export async function getArticleById(id) {
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    return rows[0];
}

// Create a new article
export async function createArticle(article) {
    const { title, content, author } = article;
    const [result] = await pool.query(
        'INSERT INTO articles (title, content, author) VALUES (?, ?, ?)',
        [title, content, author]
    );
    return { id: result.insertId, ...article };
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    const { title, content, author } = updatedData;
    await pool.query(
        'UPDATE articles SET title = ?, content = ?, author = ? WHERE id = ?',
        [title, content, author, id]
    );
    return { id, ...updatedData };
}

// Delete an article by ID
export async function deleteArticle(id) {
    await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    return { id };
}
