import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg({ type: '', text: '' });

    try {
      await axios.post(`${API_BASE_URL}/api/password-reset/`, { email });
      setMsg({ type: 'success', text: 'Thành công! Vui lòng kiểm tra email của bạn.' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Có lỗi xảy ra.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card anim-fade" onSubmit={handleSubmit}>
        <h2 className="login-title">Quên Mật Khẩu</h2>
        <p style={{fontSize: '12px', color: '#64748b', marginBottom: '15px', textAlign: 'center'}}>
          Nhập email bạn đã đăng ký để nhận link khôi phục.
        </p>
        
        {msg.text && (
          <div style={{color: msg.type === 'success' ? '#166534' : '#991b1b', backgroundColor: msg.type === 'success' ? '#dcfce7' : '#fee2e2', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', fontWeight: 'bold'}}>
            {msg.text}
          </div>
        )}
        
        <div className="input-group">
          <label>Địa chỉ Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        
        <button type="submit" className="login-btn" disabled={isLoading} style={{opacity: isLoading ? 0.7 : 1}}>
          {isLoading ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
        </button>
        
        <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
          <Link to="/login" style={{color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none'}}>Quay lại Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}