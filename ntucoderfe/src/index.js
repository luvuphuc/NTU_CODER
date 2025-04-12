import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';
import { Spinner } from '@chakra-ui/react';
import App from './App';
import { AuthProvider, useAuth } from 'contexts/AuthContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
function AuthGate() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '100px' }}>
        <Spinner size="xl" />
      </div>
    );
  }

  return <App />;
}
root.render(
  <BrowserRouter>
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  </BrowserRouter>,
);
