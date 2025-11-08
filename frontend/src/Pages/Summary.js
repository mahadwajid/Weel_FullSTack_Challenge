import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import api from "../API";
import { useNavigate } from "react-router-dom";

export default function Summary() {
  const { token, logout } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const orderId = localStorage.getItem("orderId");

  useEffect(() => {
    api.get(`/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrder(res.data))
      .catch(() => logout());
  }, []);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Summary</h2>
      <pre>{JSON.stringify(order, null, 2)}</pre>
      <button onClick={() => navigate("/delivery")}>Edit</button>
      <button onClick={logout}>Sign out</button>
    </div>
  );
}
