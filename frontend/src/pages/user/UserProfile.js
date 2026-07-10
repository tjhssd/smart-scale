import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';

import { API_BASE_URL } from '../../config';

export default function UserProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    gender: 'Nam',
    dob: '',
    defaultHeight: '',
    targetWeight: ''
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  const [isSavingPass, setIsSavingPass] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${API_BASE_URL}/api/profile/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin");
      }
      
    };
    fetchProfile();
  }, []);

  // Xử lý lưu Thông tin hồ sơ
const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${API_BASE_URL}/api/profile/`, profile, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setProfileMsg({ type: 'success', text: 'Đã cập nhật thông tin thành công!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin.' });
    } finally {
      setIsSavingProfile(false);
    }
  };
  // Xử lý Lưu Mật khẩu mới
const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    setIsSavingPass(true);
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${API_BASE_URL}/api/change-password/`, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      }, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setPassMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      if (err.response && err.response.data.error) {
        setPassMsg({ type: 'error', text: err.response.data.error });
      } else {
        setPassMsg({ type: 'error', text: 'Lỗi hệ thống, vui lòng thử lại.' });
      }
    } finally {
      setIsSavingPass(false);
    }
  };
  return (
    <div className="page-content anim-fade">
      <h1 className="page-title">Thông tin Tài khoản</h1>
      
      <div className="admin-grid">
        
        <div className="admin-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
            <User size={20} color="#3b82f6" /> 
            Hồ sơ & Chỉ số cơ sở
          </h3>
          
          {profileMsg.text && (
            <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: profileMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: profileMsg.type === 'success' ? '#166534' : '#991b1b' }}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="admin-form">
            <div className="input-group">
              <label>Họ và Tên đầy đủ</label>
              <input type="text" placeholder="VD: Nguyễn Văn A" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Số điện thoại</label>
                <input type="text" placeholder="09xx..." value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Ngày sinh</label>
                <input type="date" value={profile.dob} onChange={e => setProfile({...profile, dob: e.target.value})} />
              </div>
            </div>

            <div className="input-group">
              <label>Giới tính</label>
              <select 
                value={profile.gender} 
                onChange={e => setProfile({...profile, gender: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Chiều cao mặc định (cm)</label>
                <input type="number" placeholder="VD: 175" value={profile.defaultHeight} onChange={e => setProfile({...profile, defaultHeight: e.target.value})} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Cân nặng mục tiêu (kg)</label>
                <input type="number" placeholder="VD: 65" value={profile.targetWeight} onChange={e => setProfile({...profile, targetWeight: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={isSavingProfile} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: isSavingProfile ? 0.7 : 1, marginTop: '10px' }}>
              <Save size={18} />
              {isSavingProfile ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
            </button>
          </form>
        </div>

        <div className="admin-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
            <Lock size={20} color="#f59e0b" /> 
            Bảo mật & Đổi mật khẩu
          </h3>

          {passMsg.text && (
            <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: passMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: passMsg.type === 'success' ? '#166534' : '#991b1b' }}>
              {passMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="admin-form">
            <div className="input-group">
              <label>Mật khẩu hiện tại</label>
              <input type="password" required value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Mật khẩu mới</label>
              <input type="password" required value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Xác nhận mật khẩu mới</label>
              <input type="password" required value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} />
            </div>

            <button type="submit" className="login-btn" disabled={isSavingPass} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: isSavingPass ? 0.7 : 1, backgroundColor: '#f59e0b', marginTop: '10px' }}>
              <ShieldCheck size={18} />
              {isSavingPass ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT MẬT KHẨU"}
            </button>
          </form>

          <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
              <strong>Lưu ý:</strong> Việc thiết lập <b>Chiều cao mặc định</b> sẽ giúp hệ thống tự động tính toán chỉ số BMI trong trường hợp tính năng đo chiều cao bị lỗi hoặc hỏng.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}