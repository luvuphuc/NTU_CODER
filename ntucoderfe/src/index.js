import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';
import { Spinner } from '@chakra-ui/react';
import App from './App';
import { AuthProvider, useAuth } from 'contexts/AuthContext';
import FullPageSpinner from 'components/spinner/FullPageSpinner';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
function AuthGate() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return <App />;
}
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
    <BrowserRouter>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
