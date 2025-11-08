import express from "express";
import { suggestTime } from "../controllers/aiController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/suggest-time", authenticateToken, suggestTime);

export default router;

