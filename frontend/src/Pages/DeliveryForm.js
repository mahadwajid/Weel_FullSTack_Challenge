import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import api from "../API";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";

export default function DeliveryForm() {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ deliveryType: "", phone: "", address: "", pickupDatetime: "", notes: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editOrderId = searchParams.get("edit");
  const isEditMode = !!editOrderId;

  useEffect(() => {
    if (isEditMode && token) {
      setLoading(true);
      api.get(`/orders/${editOrderId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const order = res.data;
          const formattedDate = order.pickupDatetime 
            ? new Date(order.pickupDatetime).toISOString().slice(0, 16)
            : "";
          
          setForm({
            deliveryType: order.deliveryType || "",
            phone: order.phone || "",
            address: order.address || "",
            pickupDatetime: formattedDate,
            notes: order.notes || ""
          });
          setLoading(false);
        })
        .catch(err => {
          setError("Failed to load order");
          setLoading(false);
        });
    }
  }, [isEditMode, editOrderId, token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.type !== "datetime-local" && document.activeElement?.type === "datetime-local") {
        document.activeElement.blur();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    if (e.target.type === "datetime-local") {
      setTimeout(() => {
        e.target.blur();
      }, 100);
    }
  };

  const handleAISuggestion = async () => {
    if (!form.deliveryType) {
      setAiMessage("Please select a delivery type first");
      setTimeout(() => setAiMessage(""), 3000);
      return;
    }

    setAiLoading(true);
    setAiMessage("");
    
    try {
      const res = await api.post(
        "/ai/suggest-time",
        {
          deliveryType: form.deliveryType,
          currentTime: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.suggestedTime) {
        setForm({ ...form, pickupDatetime: res.data.suggestedTime });
        setAiMessage(res.data.aiPowered ? "AI suggested time applied!" : "Suggested time applied!");
        setTimeout(() => setAiMessage(""), 3000);
      }
    } catch (err) {
      setAiMessage("Unable to get suggestion. Please select time manually.");
      setTimeout(() => setAiMessage(""), 3000);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (isEditMode) {
        const res = await api.put(`/orders/${editOrderId}`, form, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        localStorage.setItem("orderId", res.data.id);
        navigate("/summary");
      } else {
        const res = await api.post("/orders", form, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        localStorage.setItem("orderId", res.data.id);
        navigate("/summary");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">Loading order details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>{isEditMode ? "Edit Order" : "Delivery Preference"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Delivery Type *</label>
            <select name="deliveryType" value={form.deliveryType} onChange={handleChange} required>
              <option value="">Select delivery type</option>
              <option value="IN_STORE">In Store Pickup</option>
              <option value="DELIVERY">Home Delivery</option>
              <option value="CURBSIDE">Curbside Pickup</option>
            </select>
          </div>

          {(form.deliveryType === "DELIVERY" || form.deliveryType === "CURBSIDE") && (
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                name="phone"
                type="text"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {form.deliveryType === "DELIVERY" && (
            <div className="form-group">
              <label>Delivery Address *</label>
              <input
                name="address"
                type="text"
                placeholder="Enter your delivery address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Pickup/Delivery Date & Time</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="datetime-local"
                name="pickupDatetime"
                value={form.pickupDatetime}
                onChange={handleChange}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ flex: 1 }}
              />
              {form.deliveryType && (
                <button
                  type="button"
                  onClick={handleAISuggestion}
                  disabled={aiLoading || loading}
                  className="ai-suggestion-btn"
                  title="Get AI-powered time suggestion"
                >
                  {aiLoading ? "..." : "AI"}
                </button>
              )}
            </div>
            {aiMessage && (
              <div style={{ 
                marginTop: "8px", 
                fontSize: "14px", 
                color: "#666",
                fontStyle: "italic"
              }}>
                {aiMessage}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Additional Notes (Optional)</label>
            <textarea
              name="notes"
              placeholder="Any special instructions?"
              value={form.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isEditMode ? "Update Order" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
