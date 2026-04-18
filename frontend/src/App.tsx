import './assets/css/App.css';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import {
  ChakraProvider,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import CivicDashboard from './views/admin/civic-dashboard';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={<CivicDashboard />}
        />
        <Route
          path="/"
          element={<CivicDashboard />}
        />
      </Routes>
    </ChakraProvider>
  );
}
