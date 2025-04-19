import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from 'utils/api';
import FullPageSpinner from 'components/spinner/FullPageSpinner';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');

      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        await api.get('/auth/protected-route');
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
        Cookies.remove('token'); // Xóa token nếu hết hạn
      }
    };

    checkAuth();
  }, []);

  if (isAuthorized === null) return <FullPageSpinner />;
  if (!isAuthorized) {
    navigate('/login', { replace: true });
    return null;
  }

  return children;
};

export default ProtectedRoute;
