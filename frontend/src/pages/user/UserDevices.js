import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Cpu, CheckCircle, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function UserDevices() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({ name: '', mac_address: '' });

  const fetchDevices = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/devices/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setDevices(res.data);
    } catch (err) { 
      console.error("Lỗi lấy danh sách thiết bị"); 
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

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

  return (
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
  );
}