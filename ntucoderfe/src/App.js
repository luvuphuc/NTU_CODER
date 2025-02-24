import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from 'layouts/user';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import ProblemPage from 'views/user/problem/problem';
import LoginPage from 'views/auth/login';
import ProtectedRoute from 'views/admin/protectedRoute';
export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/problem" element={<ProblemPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="admin/*" element={<ProtectedRoute element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />} />}></Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChakraProvider>
  );
}