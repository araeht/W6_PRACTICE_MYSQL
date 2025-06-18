import express from "express";
import { getJournalistById } from "../controllers/journalistController.js";

const journalistRouter = express.Router();

journalistRouter.get("/:id", getJournalistById);

export default journalistRouter;
