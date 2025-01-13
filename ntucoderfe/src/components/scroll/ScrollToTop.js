import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ScrollToTop({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.pathname.includes("/templates")) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return <>{children}</>;
}
