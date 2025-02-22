import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from 'layouts/user';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import ProblemPage from 'views/user/problem/problem';
export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/problem" element={<ProblemPage />} />
      <Route path="admin/*" element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}></Route>
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ChakraProvider>
  );
}