import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import api from "../API";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Summary() {
  const { token, logout } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const orderId = localStorage.getItem("orderId");

  useEffect(() => {
    api.get(`/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrder(res.data))
      .catch(() => logout());
  }, [token, orderId, logout]);

  if (!order) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">Loading order details...</div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getDeliveryTypeLabel = (type) => {
    const labels = {
      "IN_STORE": "In Store Pickup",
      "DELIVERY": "Home Delivery",
      "CURBSIDE": "Curbside Pickup"
    };
    return labels[type] || type;
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "600px" }}>
        <h2>Order Summary</h2>
        
        <div style={{ marginBottom: "30px" }}>
          <div style={{ 
            background: "#f5f5f5", 
            padding: "20px", 
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "10px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e0e0e0"
            }}>
              <strong style={{ color: "#666" }}>Order ID:</strong>
              <span style={{ color: "#333", fontWeight: "600" }}>#{order.id}</span>
            </div>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "10px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e0e0e0"
            }}>
              <strong style={{ color: "#666" }}>Delivery Type:</strong>
              <span style={{ color: "#1a1a1a", fontWeight: "600" }}>
                {getDeliveryTypeLabel(order.deliveryType)}
              </span>
            </div>

            {order.phone && (
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "10px",
                paddingBottom: "10px",
                borderBottom: "1px solid #e0e0e0"
              }}>
                <strong style={{ color: "#666" }}>Phone:</strong>
                <span style={{ color: "#333" }}>{order.phone}</span>
              </div>
            )}

            {order.address && (
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "10px",
                paddingBottom: "10px",
                borderBottom: "1px solid #e0e0e0"
              }}>
                <strong style={{ color: "#666" }}>Address:</strong>
                <span style={{ color: "#333", textAlign: "right", maxWidth: "60%" }}>
                  {order.address}
                </span>
              </div>
            )}

            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "10px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e0e0e0"
            }}>
              <strong style={{ color: "#666" }}>Pickup/Delivery Time:</strong>
              <span style={{ color: "#333" }}>{formatDate(order.pickupDatetime)}</span>
            </div>

            {order.notes && (
              <div style={{ marginTop: "10px" }}>
                <strong style={{ color: "#666", display: "block", marginBottom: "5px" }}>
                  Notes:
                </strong>
                <span style={{ color: "#333" }}>{order.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="button-group">
          <button className="secondary" onClick={() => navigate(`/delivery?edit=${orderId}`)}>
            Edit Order
          </button>
          <button className="secondary" onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
