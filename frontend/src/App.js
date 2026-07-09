import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import Layout chung
import Layout from './components/Layout';

// Import Trang Auth & QR
import Login from './pages/Login';
import ClaimRecord from './pages/ClaimRecord';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Import Trang User
import Dashboard from './pages/user/Dashboard';
import History from './pages/user/History';
import UserDevices from './pages/user/UserDevices';
import UserProfile from './pages/user/UserProfile';


// Import Trang Admin
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDevices from './pages/admin/AdminDevices';

// --- HÀM BẢO VỆ ROUTE (Chỉ cho phép truy cập khi đã đăng nhập) ---
const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES (Không cần đăng nhập) */}
        <Route path="/login" element={<Login />} />
        <Route path="/claim-record/:token" element={<ClaimRecord />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />

        {/* PRIVATE ROUTES (Cần đăng nhập - Được bọc trong Layout có Sidebar) */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* USER ROUTES */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="my-devices" element={<UserDevices />} />
          <Route path="profile" element={<UserProfile />} />
          {/* ADMIN ROUTES */}
          <Route path="admin/overview" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminOverview />
            </ProtectedRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="admin/devices" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDevices />
            </ProtectedRoute>
          } />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;