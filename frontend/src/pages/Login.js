import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function Login() {
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [regData, setRegData] = useState({ username: '', email: '', password: '', confirm: '' });
  const [regMsg, setRegMsg] = useState({ type: '', text: '' });

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

      // Xử lý chuyển hướng nếu đang từ trang QR văng ra
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          window.location.href = redirectUrl; 
      } else {
          // Chuyển hướng theo role
          if (response.data.is_admin) {
            navigate('/admin/overview');
          } else {
            navigate('/dashboard');
          }
      }
    } catch (err) {
      setAuthError('Tài khoản hoặc mật khẩu không đúng!');
    }
  };

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
            <span style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setIsRegisterMode(true)}>Đăng ký</span>
          </p>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
             <span style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/forgot-password')}>
               Quên mật khẩu?
             </span>
          </div>
        </form>
      )}
    </div>
  );
}