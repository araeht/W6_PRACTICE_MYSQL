import express from "express";
import { getCategoryById } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/:id", getCategoryById);

export default categoryRouter;
