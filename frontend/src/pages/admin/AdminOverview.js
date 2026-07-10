import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Cpu, Activity, AlertCircle, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminOverview() {
  const [stats, setStats] = useState({ kpi: {}, chart: [] });
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('all');

  // Lấy danh sách toàn bộ thiết bị để đưa vào Dropdown
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/admin-api/devices/`, { headers: { Authorization: `Token ${token}` } })
         .then(res => setDevices(res.data))
         .catch(err => console.log(err));
  }, []);

  // Lấy số liệu thống kê (Tự động gọi lại mỗi khi Admin đổi thiết bị)
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/admin-api/stats/?device_id=${selectedDevice}`, { headers: { Authorization: `Token ${token}` } })
         .then(res => setStats(res.data))
         .catch(err => console.log(err));
  }, [selectedDevice]);

  return (
    <div className="page-content anim-fade">
      <h2 className="section-title">TỔNG QUAN HỆ THỐNG</h2>
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">TỔNG NGƯỜI DÙNG</span>
          <div className="stat-main"><span className="stat-value">{stats.kpi.total_users || 0}</span></div>
          <div className="stat-footer" style={{color: '#3b82f6'}}><Users size={14}/> Toàn hệ thống</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">THIẾT BỊ HOẠT ĐỘNG</span>
          <div className="stat-main"><span className="stat-value">{stats.kpi.active_devices || 0}</span></div>
          <div className="stat-footer" style={{color: '#10b981'}}><Cpu size={14}/> Đang kết nối</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">THIẾT BỊ OFFLINE</span>
          <div className="stat-main"><span className="stat-value">{stats.kpi.offline_devices || 0}</span></div>
          <div className="stat-footer" style={{color: '#ef4444'}}><AlertCircle size={14}/> Đã khóa/Tắt</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">LƯỢT ĐO HÔM NAY</span>
          <div className="stat-main"><span className="stat-value">{stats.kpi.today_records || 0}</span></div>
          <div className="stat-footer" style={{color: '#8b5cf6'}}><Activity size={14}/> {selectedDevice === 'all' ? 'Toàn hệ thống' : 'Thiết bị chọn'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ margin: 0 }}>LƯU LƯỢNG SỬ DỤNG</h2>
        
        {/* BỘ LỌC THIẾT BỊ CHO ADMIN */}
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '5px 15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
          <Filter size={16} color="#64748b"/>
          <select 
            value={selectedDevice} 
            onChange={(e) => setSelectedDevice(e.target.value)}
            style={{border: 'none', outline: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#334155'}}
          >
            <option value="all">Tất cả thiết bị</option>
            {devices.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.mac}) - Chủ: {d.owner}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="chart-section">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.chart}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} allowDecimals={false} />
            <Tooltip contentStyle={{borderRadius:'10px', border:'none', boxShadow:'0 5px 15px rgba(0,0,0,0.1)'}} />
            <Line type="monotone" dataKey="count" name="Số lượt đo" stroke="#8b5cf6" strokeWidth={4} dot={{r: 4, fill: '#8b5cf6'}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}