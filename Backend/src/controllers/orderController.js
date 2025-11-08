import { Order } from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { deliveryType, phone, address, pickupDatetime, notes } = req.body;

    const order = await Order.create({
      userId: req.user.id,
      deliveryType,
      phone,
      address,
      pickupDatetime,
      notes,
    });

    res.json(order);
  } catch (err) {
    console.error("CreateOrder error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      where: { id, userId: req.user.id },
    });

    if (!order) return res.sendStatus(404);
    res.json(order);
  } catch (err) {
    console.error("GetOrder error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      where: { id, userId: req.user.id },
    });

    if (!order) return res.sendStatus(404);

    const { deliveryType, phone, address, pickupDatetime, notes } = req.body;
    await order.update({
      deliveryType,
      phone,
      address,
      pickupDatetime,
      notes,
    });
    
    res.json(order);
  } catch (err) {
    console.error("UpdateOrder error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
