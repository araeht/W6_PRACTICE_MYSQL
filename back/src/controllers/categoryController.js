import { pool } from "../utils/database.js";

// GET /api/categories/:id
export async function getCategoryById(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name FROM category WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
