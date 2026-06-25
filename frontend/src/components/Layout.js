import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, History, User, LogOut, Shield, Users, Cpu, Settings 
} from 'lucide-react';
import '../App.css';
export default function Layout() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">Smart Scale</div>
        <nav className="sidebar-nav">
          
          {!isAdmin ? (
            <>
              <div className="sidebar-label">NGƯỜI DÙNG</div>
              <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={20}/> Tổng quan
              </NavLink>
              <NavLink to="/history" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <History size={20}/> Lịch sử
              </NavLink>
              <NavLink to="/profile" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Settings size={20}/> Thông tin cá nhân
              </NavLink>
              <NavLink to="/my-devices" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Cpu size={20}/> Thiết bị của tôi
              </NavLink>
            </>
          ) : (
            <>
              <div className="sidebar-label" style={{marginTop: '20px'}}>QUẢN TRỊ VIÊN</div>
              <NavLink to="/admin/overview" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Shield size={20}/> Thống kê hệ thống
              </NavLink>
              <NavLink to="/admin/users" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Users size={20}/> Quản lý Người dùng
              </NavLink>
              <NavLink to="/admin/devices" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Cpu size={20}/> Quản lý Thiết bị
              </NavLink>
            </>
          )}

          <div className="nav-item logout" style={{marginTop: 'auto'}} onClick={handleLogout}>
            <LogOut size={20}/> Đăng xuất
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="user-profile"><User size={20}/> {username}</div>
        </header>

        <section className="dashboard-body">
          <Outlet /> 
        </section>
      </main>
    </div>
  );
}