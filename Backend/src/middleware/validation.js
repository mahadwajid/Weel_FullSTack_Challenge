export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  next();
};

export const validateOrder = (req, res, next) => {
  const { deliveryType, phone, address, pickupDatetime } = req.body;

  if (!deliveryType) {
    return res.status(400).json({ error: "Delivery type is required" });
  }

  const validTypes = ["IN_STORE", "DELIVERY", "CURBSIDE"];
  if (!validTypes.includes(deliveryType)) {
    return res.status(400).json({ error: "Invalid delivery type" });
  }

  if ((deliveryType === "DELIVERY" || deliveryType === "CURBSIDE") && !phone) {
    return res.status(400).json({ error: "Phone is required for this delivery type" });
  }

  if (deliveryType === "DELIVERY" && !address) {
    return res.status(400).json({ error: "Address is required for delivery" });
  }

  if (phone && phone.length < 10) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  if (pickupDatetime) {
    const pickupDate = new Date(pickupDatetime);
    const now = new Date();
    if (pickupDate <= now) {
      return res.status(400).json({ error: "Pickup time must be in the future" });
    }
  }

  next();
};

