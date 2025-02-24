import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Kiểm tra token
    const roleID = localStorage.getItem("roleID");

    if (!token || !roleID || parseInt(roleID) !== 1) {
      navigate("/login", { replace: true }); // Nếu không có quyền, chuyển hướng về login
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (isAuthenticated === null) return null; // Tránh render trang trắng

  return children;
};

export default ProtectedRoute;
