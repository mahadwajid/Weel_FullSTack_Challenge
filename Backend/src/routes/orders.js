import express from "express";
import { createOrder, getOrder, updateOrder } from "../controllers/orderController.js";
import { validateOrder } from "../middleware/validation.js";

const router = express.Router();

router.post("/", validateOrder, createOrder);
router.get("/:id", getOrder);
router.put("/:id", validateOrder, updateOrder);

export default router;
