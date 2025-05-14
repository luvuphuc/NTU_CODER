import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [coder, setCoder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get('token');
      console.log('Token:', token);
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get('/Auth/me');
        if (res.status === 200) {
          setCoder(res.data);
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const logout = async () => {
    try {
      await api.post('/Auth/logout');
    } catch (e) {}
    Cookies.remove('token');
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
