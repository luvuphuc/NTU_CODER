import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from 'layouts/user';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import ProblemPage from 'views/user/problem/problem_list';
import LoginPage from 'views/auth/login';
import ProtectedRoute from 'views/admin/protectedRoute';
import Submission from 'views/user/problem/submission';
import ContestPage from 'views/user/contest';
export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/problem" element={<ProblemPage />} />
      <Route path="/problem/:id" element={<Submission/>} />
      <Route path="/contest" element={<ContestPage/>} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route
          path="admin/*"
          element={
            
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            
          }
        />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChakraProvider>
  );
}