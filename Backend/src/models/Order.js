import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import { User } from "./User.js";

export const Order = sequelize.define("Order", {
  deliveryType: DataTypes.STRING,
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
  pickupDatetime: DataTypes.DATE,
  notes: DataTypes.STRING,
});

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });
