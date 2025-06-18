import { Router } from "express";
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle,getArticlesByJournalistId, getArticlesByCategoryId, getAllCategories  } from "../controllers/articleController.js";

const articleRouter = Router();
articleRouter.get("/", getAllArticles);
articleRouter.get("/categories", getAllCategories);
articleRouter.get("/journalists/:id/articles", getArticlesByJournalistId);
articleRouter.get("/categories/:id/articles", getArticlesByCategoryId);
articleRouter.get("/:id", getArticleById);
articleRouter.post("/", createArticle);
articleRouter.put("/:id", updateArticle);
articleRouter.delete("/:id", deleteArticle);

export default articleRouter;
