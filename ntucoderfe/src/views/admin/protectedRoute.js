import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from 'utils/api';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');

      if (!token) {
        setIsAuthorized(false);
        navigate('/login', { replace: true });
        return;
      }

      try {
        await api.get('/auth/protected-route', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
        Cookies.remove('token'); // Xóa token nếu hết hạn
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthorized === null) return <div>Loading...</div>;

  return isAuthorized ? children : null;
};

export default ProtectedRoute;
