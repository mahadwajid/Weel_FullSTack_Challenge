import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import api from "../API";
import { useNavigate } from "react-router-dom";

export default function DeliveryForm() {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ deliveryType: "", phone: "", address: "", pickupDatetime: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/orders", form, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem("orderId", res.data.id);
      navigate("/summary");
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Delivery Preference</h2>
      <select name="deliveryType" onChange={handleChange}>
        <option value="">Select</option>
        <option value="IN_STORE">In Store</option>
        <option value="DELIVERY">Delivery</option>
        <option value="CURBSIDE">Curbside</option>
      </select>

      {(form.deliveryType === "DELIVERY" || form.deliveryType === "CURBSIDE") && (
        <input name="phone" placeholder="Phone" onChange={handleChange} />
      )}

      {form.deliveryType === "DELIVERY" && (
        <input name="address" placeholder="Address" onChange={handleChange} />
      )}

      <input type="datetime-local" name="pickupDatetime" onChange={handleChange} />
      <button>Next</button>
    </form>
  );
}
