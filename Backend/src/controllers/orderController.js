import { pool } from "../db.js";

export const createOrder = async (req, res) => {
  try {
    const { deliveryType, deliveryTime } = req.body;

    // Validation
    if (!deliveryType)
      return res.status(400).json({ message: "Delivery type is required" });
    if (new Date(deliveryTime) < new Date())
      return res.status(400).json({ message: "Delivery time must be in the future" });

    const result = await pool.query(
      "INSERT INTO orders (user_id, delivery_type, delivery_time) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, deliveryType, deliveryTime]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("CreateOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ]);

    if (result.rowCount === 0) return res.status(404).json({ message: "Order not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("GetOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryType, deliveryTime } = req.body;

    const result = await pool.query(
      "UPDATE orders SET delivery_type = $1, delivery_time = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [deliveryType, deliveryTime, id, req.user.id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: "Order not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("UpdateOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
