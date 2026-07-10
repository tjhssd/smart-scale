import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDevices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/admin-api/devices/`, { headers: { Authorization: `Token ${token}` } })
         .then(res => setDevices(res.data));
  }, []);

  return (
    <div className="page-content anim-fade">
      <h1 className="page-title">Quản lý Thiết bị (Toàn hệ thống)</h1>
      <div className="table-container">
        <table className="history-table">
          <thead><tr><th>Mã MAC</th><th>Tên thiết bị</th><th>Chủ sở hữu</th><th>Ngày đăng ký</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.id}>
                <td style={{fontFamily: 'monospace'}}>{d.mac}</td>
                <td className="fw-bold">{d.name}</td>
                <td><span className="device-badge">{d.owner}</span></td>
                <td>{d.registered_at}</td>
                <td>
                  <span style={{ color: d.is_active ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                    {d.is_active ? 'Online' : 'Vô hiệu hóa'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}