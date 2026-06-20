import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  LayoutDashboard, History, User, LogOut, Shield, Users, Cpu,
  Thermometer, Activity, Droplets, Ruler, Scale, Plus, Trash2, CheckCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import './App.css';

// Import 3 trang Admin
import AdminOverview from './components/AdminOverview';
import AdminUsers from './components/AdminUsers';
import AdminDevices from './components/AdminDevices';
// IMPORT TRANG QUÉT MÃ QR (Nhớ kiểm tra đúng đường dẫn thư mục)
import ClaimRecord from './components/ClaimRecord'; 
const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  // --- STATES CHUNG ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // --- STATES ĐĂNG NHẬP / ĐĂNG KÝ ---
  const [authError, setAuthError] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [regData, setRegData] = useState({ username: '', email: '', password: '', confirm: '' });
  const [regMsg, setRegMsg] = useState({ type: '', text: '' });
  
  // --- STATES DỮ LIỆU SỨC KHỎE ---
  const [data, setData] = useState({ 
    weight: 0, heart_rate: 0, spo2: 0, temperature: 0, height: 0, bmi: 0 
  });
  const [historyList, setHistoryList] = useState([]);

  // --- STATES QUẢN LÝ THIẾT BỊ (USER) ---
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({ name: '', mac_address: '' });

  // Khôi phục phiên đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(adminStatus);
      if (adminStatus) {
        setActiveTab('admin_overview');
      }
    }
  }, []);

  // ===================== CÁC HÀM XỬ LÝ =====================
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegMsg({ type: '', text: '' });
    if (regData.password !== regData.confirm) {
      setRegMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/register/`, {
        username: regData.username, email: regData.email, password: regData.password
      });
      setRegMsg({ type: 'success', text: 'Đăng ký thành công! Vui lòng đăng nhập.' });
      setTimeout(() => { setIsRegisterMode(false); setRegMsg({ type: '', text: '' }); }, 2000);
    } catch (err) {
      setRegMsg({ type: 'error', text: 'Tài khoản đã tồn tại hoặc lỗi kết nối!' });
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        username: credentials.username, password: credentials.password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('isAdmin', response.data.is_admin);
      setIsLoggedIn(true);
      setIsAdmin(response.data.is_admin);

      // CẬP NHẬT: Kiểm tra xem user có đang từ trang quét QR văng ra đây không
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          window.location.href = redirectUrl; // Chuyển lại trang QR
      } else {
          window.location.reload(); // Đăng nhập bình thường
      }

    } catch (err) {
      setAuthError('Tài khoản hoặc mật khẩu không đúng!');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.reload();
  };

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/records/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.data.length > 0) {
        const processed = res.data.map(item => ({
          ...item,
          bmi: parseFloat((item.weight / Math.pow(item.height / 100, 2)).toFixed(1)),
          timeLabel: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fullDate: new Date(item.created_at).toLocaleString('vi-VN')
        }));
        setData(processed[0]);
        setHistoryList(processed);
      }
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  };

  const fetchDevices = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/devices/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setDevices(res.data);
    } catch (err) { console.error("Lỗi lấy danh sách thiết bị"); }
  };

  const handleRegisterDevice = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/api/devices/`, newDevice, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setNewDevice({ name: '', mac_address: '' });
      fetchDevices();
      alert("Đăng ký thiết bị thành công!");
    } catch (err) {
      alert("Lỗi: Mã MAC này đã tồn tại hoặc không hợp lệ!");
    }
  };

  const handleDeleteDevice = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thiết bị này?")) {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/devices/${id}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      fetchDevices();
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      if (activeTab === 'admin') fetchDevices(); 
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, activeTab]);

  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return "Gầy";
    if (bmi < 24.9) return "Bình thường";
    return "Thừa cân";
  };

  const renderMainApp = () => {
    if (!isLoggedIn) {
      return (
        <div className="login-container">
          {isRegisterMode ? (
            <form className="login-card anim-fade" onSubmit={handleRegister}>
              <h2 className="login-title">Đăng Ký Tài Khoản</h2>
              {regMsg.text && <div className={`status-msg ${regMsg.type}`}>{regMsg.text}</div>}
              <div className="input-group"><label>Tên tài khoản</label><input type="text" required onChange={e => setRegData({...regData, username: e.target.value})} /></div>
              <div className="input-group"><label>Email</label><input type="email" onChange={e => setRegData({...regData, email: e.target.value})} /></div>
              <div className="input-group"><label>Mật khẩu</label><input type="password" required onChange={e => setRegData({...regData, password: e.target.value})} /></div>
              <div className="input-group"><label>Xác nhận mật khẩu</label><input type="password" required onChange={e => setRegData({...regData, confirm: e.target.value})} /></div>
              <button type="submit" className="login-btn">TẠO TÀI KHOẢN</button>
              <p style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem'}}>
                Đã có tài khoản? <span style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setIsRegisterMode(false)}>Đăng nhập</span>
              </p>
            </form>
          ) : (
            <form className="login-card anim-fade" onSubmit={handleAuth}>
              <h2 className="login-title">Smart Scale Login</h2>
              <div className="input-group"><label>Tài khoản</label><input type="text" required onChange={e => setCredentials({...credentials, username: e.target.value})} /></div>
              <div className="input-group"><label>Mật khẩu</label><input type="password" required onChange={e => setCredentials({...credentials, password: e.target.value})} /></div>
              {authError && <p className="error-text">{authError}</p>}
              <button type="submit" className="login-btn">ĐĂNG NHẬP</button>
              <p style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem'}}>
                Chưa có tài khoản? <span style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setIsRegisterMode(true)}>Đăng ký</span>
              </p>
            </form>
          )}
        </div>
      );
    }

    return (
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-logo">Smart Scale</div>
          <nav className="sidebar-nav">
            {!isAdmin && (
              <>
                <div className="sidebar-label">NGƯỜI DÙNG</div>
                <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                  <LayoutDashboard size={20}/> Tổng quan
                </div>
                <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                  <History size={20}/> Lịch sử
                </div>
                <div className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
                  <Cpu size={20}/> Thiết bị của tôi
                </div>
              </>
            )}
            {isAdmin && (
              <>
                <div className="sidebar-label" style={{marginTop: '20px'}}>QUẢN TRỊ VIÊN</div>
                <div className={`nav-item ${activeTab === 'admin_overview' ? 'active' : ''}`} onClick={() => setActiveTab('admin_overview')}>
                  <Shield size={20}/> Thống kê hệ thống
                </div>
                <div className={`nav-item ${activeTab === 'admin_users' ? 'active' : ''}`} onClick={() => setActiveTab('admin_users')}>
                  <Users size={20}/> Quản lý Người dùng
                </div>
                <div className={`nav-item ${activeTab === 'admin_devices' ? 'active' : ''}`} onClick={() => setActiveTab('admin_devices')}>
                  <Cpu size={20}/> Quản lý Thiết bị
                </div>
              </>
            )}
            <div className="nav-item logout" style={{marginTop: 'auto'}} onClick={handleLogout}><LogOut size={20}/> Đăng xuất</div>
          </nav>
        </aside>

        <main className="main-content">
          <header className="top-header">
            <div className="user-profile"><User size={20}/> {localStorage.getItem('username') || 'User'}</div>
          </header>

          <section className="dashboard-body">
            {activeTab === 'overview' && (
              <div className="page-content anim-fade">
                <h2 className="section-title">CHỈ SỐ SINH HIỆU</h2>
                <div className="stats-row">
                  <StatCard label="NHIỆT ĐỘ" value={data.temperature} unit="°C" color="#ef4444" icon={<Thermometer size={14}/>}/>
                  <StatCard label="NHỊP TIM" value={data.heart_rate} unit="bpm" color="#ec4899" icon={<Activity size={14}/>}/>
                  <StatCard label="SPO2" value={data.spo2} unit="%" color="#06b6d4" icon={<Droplets size={14}/>}/>
                </div>

                <h2 className="section-title">THỂ TRẠNG & BMI</h2>
                <div className="stats-row">
                  <StatCard label="CHIỀU CAO" value={data.height} unit="cm" color="#3b82f6" icon={<Ruler size={14}/>}/>
                  <StatCard label="CÂN NẶNG" value={data.weight} unit="kg" color="#10b981" icon={<Scale size={14}/>}/>
                  <div className="bmi-card">
                     <span className="bmi-label">BMI</span>
                     <div className="bmi-value">{data.bmi}</div>
                     <span className={`bmi-status ${getBmiStatus(data.bmi)}`}>{getBmiStatus(data.bmi)}</span>
                  </div>
                </div>

                <h2 className="section-title">XU HƯỚNG THEO DÕI</h2>
                <div className="chart-section">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[...historyList].reverse().slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="timeLabel" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                      <Tooltip contentStyle={{borderRadius:'10px', border:'none', boxShadow:'0 5px 15px rgba(0,0,0,0.1)'}} />
                      <Legend verticalAlign="top" align="right" iconType="circle" />
                      <Line type="monotone" dataKey="bmi" stroke="#6366f1" strokeWidth={4} name="BMI" dot={{r:4, fill:'#6366f1'}} />
                      <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={4} name="Cân nặng" dot={{r:4, fill:'#10b981'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="page-content anim-fade">
                <h1 className="page-title">Lịch sử đo lường</h1>
                <div className="table-container">
                  <table className="history-table">
                    <thead>
                      <tr><th>Thiết bị</th><th>Thời gian</th><th>Cân nặng</th><th>Chiều cao</th><th>Nhiệt độ</th><th>SpO2</th><th>BMI</th></tr>
                    </thead>
                    <tbody>
                      {historyList.map((item, idx) => (
                        <tr key={idx}>
                          <td><span className="device-badge">{item.device_name || 'Không rõ'}</span></td>
                          <td>{item.fullDate}</td><td>{item.weight} kg</td><td>{item.height} cm</td>
                          <td>{item.temperature} °C</td><td>{item.spo2}%</td><td className="fw-bold">{item.bmi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="page-content anim-fade">
                <h1 className="page-title">Thiết bị của tôi</h1>
                <div className="admin-grid">
                  <div className="admin-card">
                    <h3><Plus size={18}/> Đăng ký thiết bị mới</h3>
                    <p className="sub-text">Nhập mã MAC in dưới thiết bị để kết nối</p>
                    <form onSubmit={handleRegisterDevice} className="admin-form">
                      <div className="input-group">
                        <label>Tên gợi nhớ (VD: Cân phòng khách)</label>
                        <input type="text" value={newDevice.name} onChange={e => setNewDevice({...newDevice, name: e.target.value})} required />
                      </div>
                      <div className="input-group">
                        <label>Địa chỉ MAC (Mã phần cứng)</label>
                        <input type="text" placeholder="AA:BB:CC:11:22:33" value={newDevice.mac_address} onChange={e => setNewDevice({...newDevice, mac_address: e.target.value})} required />
                      </div>
                      <button type="submit" className="login-btn">KÍCH HOẠT THIẾT BỊ</button>
                    </form>
                  </div>
                  <div className="admin-card">
                    <h3><Cpu size={18}/> Danh sách kết nối ({devices.length})</h3>
                    <div className="device-list">
                      {devices.length === 0 ? (
                        <p style={{color: '#94a3b8', fontSize: '0.9rem'}}>Chưa có thiết bị nào được kết nối.</p>
                      ) : (
                        devices.map(device => (
                          <div key={device.id} className="device-item">
                            <div className="device-info">
                              <div className="device-name">{device.name}</div>
                              <div className="device-mac">{device.mac_address}</div>
                            </div>
                            <div className="device-status">
                              <span className="status-online"><CheckCircle size={14}/> Hoạt động</span>
                              <button className="btn-icon-delete" onClick={() => handleDeleteDevice(device.id)}><Trash2 size={16}/></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isAdmin && activeTab === 'admin_overview' && <AdminOverview />}
            {isAdmin && activeTab === 'admin_users' && <AdminUsers />}
            {isAdmin && activeTab === 'admin_devices' && <AdminDevices />}

          </section>
        </main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Route dành riêng cho tính năng quét QR */}
        <Route path="/claim-record/:token" element={<ClaimRecord />} />
        
        {/* Route mặc định: Trả về trang Đăng nhập hoặc Dashboard như cũ */}
        <Route path="*" element={renderMainApp()} />
      </Routes>
    </Router>
  );
}

const StatCard = ({ label, value, unit, color, icon }) => (
  <div className="stat-card">
    <span className="stat-label">{label}</span>
    <div className="stat-main">
      <span className="stat-value">{value}</span>
      <span className="stat-unit">{unit}</span>
    </div>
    <div className="stat-footer" style={{color}}>{icon} <span style={{marginLeft:'5px'}}>Mới nhất</span></div>
  </div>
);

export default App;