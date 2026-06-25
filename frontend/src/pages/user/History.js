import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function History() {
  const [historyList, setHistoryList] = useState([]);
  
  // --- STATES PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // Số dòng muốn hiển thị trên 1 trang

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/records/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        const processed = res.data.map(item => ({
          ...item,
          bmi: parseFloat((item.weight / Math.pow(item.height / 100, 2)).toFixed(1)),
          fullDate: new Date(item.created_at).toLocaleString('vi-VN')
        }));
        setHistoryList(processed);
      } catch (err) {
        console.error("Lỗi lấy lịch sử", err);
      }
    };
    fetchHistory();
  }, []);

  // --- LOGIC TÍNH TOÁN PHÂN TRANG ---
  const totalPages = Math.max(1, Math.ceil(historyList.length / recordsPerPage));
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // Cắt ra mảng dữ liệu chỉ dành riêng cho trang hiện tại
  const currentRecords = historyList.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="page-content anim-fade">
      <h1 className="page-title">Lịch sử đo lường</h1>
      <div className="table-container">
        <table className="history-table">
          <thead>
            <tr><th>Thiết bị</th><th>Thời gian</th><th>Cân nặng</th><th>Chiều cao</th><th>Nhiệt độ</th><th>SpO2</th><th>BMI</th></tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Chưa có dữ liệu</td></tr>
            ) : (
              // Map qua currentRecords thay vì historyList
              currentRecords.map((item, idx) => (
                <tr key={idx}>
                  <td><span className="device-badge">{item.device_name || 'Không rõ'}</span></td>
                  <td>{item.fullDate}</td>
                  <td>{item.weight} kg</td>
                  <td>{item.height} cm</td>
                  <td>{item.temperature} °C</td>
                  <td>{item.spo2}%</td>
                  <td className="fw-bold">{item.bmi}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* --- THANH ĐIỀU KHIỂN PHÂN TRANG --- */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '20px 0' }}>
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            title="Trang trước"
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#f1f5f9' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center' }}
          >
            &#10094;
          </button>
          
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#475569' }}>
            Trang {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
            title="Trang sau"
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center' }}
          >
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
}