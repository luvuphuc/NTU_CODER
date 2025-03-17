import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import initialTheme from './theme/theme';
import ProtectedRoute from 'views/admin/protectedRoute';
import routes from 'routes';
import LoginPage from 'views/auth/login';
import HomePage from 'views/user/homepage';
import AdminLayout from './layouts/admin';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {routes.map((route, index) =>
          route.layout === '/user' ? (
            <Route key={index} path={route.path} element={route.component} />
          ) : null,
        )}
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChakraProvider>
  );
}
