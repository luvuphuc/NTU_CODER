import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [coder, setCoder] = useState(() => {
    const cached = sessionStorage.getItem('coder');
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState(!coder);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get('token');
      if (!token || coder) return;

      try {
        const res = await api.get('/Auth/me');
        if (res.status === 200) {
          setCoder(res.data);
          sessionStorage.setItem('coder', JSON.stringify(res.data));
        }
      } catch (err) {
        console.log('Lỗi xác thực:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [coder]);

  const logout = async () => {
    try {
      await api.post('/Auth/logout');
    } catch (e) {
      console.log('Lỗi khi đăng xuất:', e);
    }
    Cookies.remove('token');
    sessionStorage.removeItem('coder');
    setCoder(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ coder, setCoder, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
