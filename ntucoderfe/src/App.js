import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import initialTheme from './theme/theme';
import ProtectedRoute from 'views/admin/protectedRoute';
import routes from 'routes';
import LoginPage from 'views/auth/login';
import AdminLayout from './layouts/admin';
import HomePage from 'views/user/homepage';
export default function Main() {
  const [currentTheme] = useState(initialTheme);

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
        {routes
          .filter((route) => route.layout === '/user' && route.items)
          .flatMap((parentRoute) =>
            parentRoute.items.map((child, idx) => (
              <Route
                key={`child-${idx}`}
                path={`${parentRoute.path}${child.path}`}
                element={child.component}
              />
            )),
          )}
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </ChakraProvider>
  );
}
