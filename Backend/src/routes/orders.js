import express from "express";
import { Order } from "../models/Order.js";

const router = express.Router();

// POST /orders
router.post("/", async (req, res) => {
  const { deliveryType, phone, address, pickupDatetime, notes } = req.body;

  if (!deliveryType) return res.status(400).json({ error: "Delivery type required" });
  if ((deliveryType === "DELIVERY" || deliveryType === "CURBSIDE") && !phone)
    return res.status(400).json({ error: "Phone required" });

  const now = new Date();
  if (pickupDatetime && new Date(pickupDatetime) <= now)
    return res.status(400).json({ error: "Pickup time must be in future" });

  const order = await Order.create({
    userId: req.user.id,
    deliveryType,
    phone,
    address,
    pickupDatetime,
    notes,
  });
  res.json(order);
});

// GET /orders/:id
router.get("/:id", async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!order) return res.sendStatus(404);
  res.json(order);
});

// PUT /orders/:id
router.put("/:id", async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!order) return res.sendStatus(404);
  await order.update(req.body);
  res.json(order);
});

export default router;
