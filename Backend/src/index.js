import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import { authenticateToken } from "./middleware/auth.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/orders", authenticateToken, orderRoutes);

const PORT = process.env.PORT || 8080;

sequelize.authenticate()
  .then(() => {
    console.log("Database connected");
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
