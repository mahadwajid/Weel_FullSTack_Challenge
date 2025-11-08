import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
});
