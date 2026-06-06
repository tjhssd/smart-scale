import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Unlock, ShieldAlert } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  const fetchUsers = () => {
    axios.get('http://127.0.0.1:8000/api/admin-api/users/', { headers: { Authorization: `Token ${token}` } })
         .then(res => setUsers(res.data));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleUserStatus = async (id, isSuperuser) => {
    if (isSuperuser) return alert("Không thể khóa tài khoản Admin!");
    await axios.post(`http://127.0.0.1:8000/api/admin-api/users/${id}/toggle/`, {}, { headers: { Authorization: `Token ${token}` } });
    fetchUsers(); // Cập nhật lại bảng
  };

  return (
    <div className="page-content anim-fade">
      <h1 className="page-title">Quản lý Người dùng</h1>
      <div className="table-container">
        <table className="history-table">
          <thead><tr><th>ID</th><th>Tài khoản</th><th>Email</th><th>Ngày tham gia</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="fw-bold">#{u.id}</td>
                <td>{u.username} {u.is_superuser && <ShieldAlert size={14} color="#f59e0b" title="Admin"/>}</td>
                <td>{u.email || 'N/A'}</td>
                <td>{new Date(u.date_joined).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span style={{ color: u.is_active ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                    {u.is_active ? 'Hoạt động' : 'Bị khóa'}
                  </span>
                </td>
                <td>
                  <button onClick={() => toggleUserStatus(u.id, u.is_superuser)} style={{ background: 'none', border: 'none', cursor: u.is_superuser ? 'not-allowed' : 'pointer', color: u.is_active ? '#ef4444' : '#10b981' }}>
                    {u.is_active ? <Lock size={18}/> : <Unlock size={18}/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}