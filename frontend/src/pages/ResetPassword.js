import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function ResetPassword() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ newPassword: '', confirm: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      setMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/password-reset-confirm/${uidb64}/${token}/`, { 
        new_password: passwords.newPassword 
      });
      setMsg({ type: 'success', text: 'Đổi mật khẩu thành công! Tự động chuyển về đăng nhập...' });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setMsg({ type: 'error', text: 'Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ!' });
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card anim-fade" onSubmit={handleSubmit}>
        <h2 className="login-title">Đặt Mật Khẩu Mới</h2>
        
        {msg.text && (
          <div style={{color: msg.type === 'success' ? '#166534' : '#991b1b', backgroundColor: msg.type === 'success' ? '#dcfce7' : '#fee2e2', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', fontWeight: 'bold'}}>
            {msg.text}
          </div>
        )}
        
        <div className="input-group">
          <label>Mật khẩu mới</label>
          <input type="password" required value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Xác nhận mật khẩu</label>
          <input type="password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
        </div>
        
        <button type="submit" className="login-btn" disabled={isLoading} style={{opacity: isLoading ? 0.7 : 1}}>
          {isLoading ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT MẬT KHẨU"}
        </button>

        <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
          <Link to="/login" style={{color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none'}}>Về Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}