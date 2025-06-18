import { pool } from "../utils/database.js";

// GET /api/journalists/:id
export async function getJournalistById(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, bio FROM journalist WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Journalist not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching journalist by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
