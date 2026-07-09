import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';

const processedTokens = new Set(); 

const ClaimRecord = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [recordInfo, setRecordInfo] = useState(null);
    const [status, setStatus] = useState('Đang đồng bộ dữ liệu với cân thông minh...');
    const [error, setError] = useState(false);
    
    useEffect(() => {
        const claimData = async () => {
            const userToken = localStorage.getItem('token'); 
            
            if (!userToken) {
                localStorage.setItem('redirectAfterLogin', `/claim-record/${token}`);
                navigate('/login');
                return; 
            }

            if (processedTokens.has(token)) {
                return;
            }
            
            processedTokens.add(token);

            try {
                const response = await axios.post(
                    `http://${window.location.hostname}:8000/api/claim-record/${token}/`,
                    {}, 
                    { headers: { Authorization: `Token ${userToken}` } }
                );
                
                setRecordInfo(response.data.data);
                setStatus('Thành công!');
                localStorage.removeItem('redirectAfterLogin');

            } catch (err) {
                setError(true);
                
                if (err.response && err.response.status === 404) {
                    setStatus('Mã QR không hợp lệ, đã hết hạn hoặc đã được người khác lưu.');
                } else if (err.response && err.response.status === 400) {
                     setStatus('Lỗi xác thực: ' + (err.response.data?.message || 'Mã QR đã được sử dụng.'));
                } else {
                    setStatus('Đã xảy ra lỗi khi kết nối với máy chủ Backend.');
                }
            }
        };

        claimData();
    }, [token, navigate]);

    // Hàm tạo lời khuyên tự động
    const generateHealthAdvice = (data) => {
        let advice = [];
        if (data.bmi < 18.5) advice.push("🔹 BMI: Thể trạng thiếu cân. Bạn cần tăng cường khẩu phần ăn giàu protein và tinh bột phức hợp.");
        else if (data.bmi >= 18.5 && data.bmi <= 24.9) advice.push("🔹 BMI: Thể trạng bình thường. Rất tuyệt vời, hãy duy trì lối sống hiện tại!");
        else advice.push("🔹 BMI: Có dấu hiệu thừa cân/béo phì. Cần kiểm soát lượng calo nạp vào và tập luyện cardio ít nhất 30 phút/ngày.");

        if (data.temperature > 37.5) advice.push("⚠️ Thân nhiệt: Đang có dấu hiệu sốt nhẹ đến cao. Hãy uống nhiều nước và theo dõi thêm.");
        else if (data.temperature < 35.5) advice.push("⚠️ Thân nhiệt: Thấp hơn mức bình thường. Hãy giữ ấm cơ thể.");

        if (data.heart_rate > 100) advice.push("⚠️ Nhịp tim: Đang đập nhanh (Tachycardia). Hãy ngồi nghỉ ngơi thư giãn từ 5-10 phút.");
        else if (data.heart_rate < 60) advice.push("🔹 Nhịp tim: Chậm (Bradycardia) - Thường thấy ở người chơi thể thao cường độ cao.");

        if (data.spo2 < 95) advice.push("🚨 SpO2: Nồng độ oxy trong máu thấp. Cần hít thở sâu, mở cửa thông thoáng. Nếu kèm khó thở, hãy đến cơ sở y tế.");
        else advice.push("🔹 SpO2: Lượng oxy trong máu rất tốt.");

        return advice;
    };

    // Hàm xuất giao diện ra file PDF
    const handleExportPDF = () => {
        const element = document.getElementById('health-report-card');
        const opt = {
            margin:       0.5,
            filename:     `Bao_cao_suc_khoe_${new Date().getTime()}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    // --- COMPONENT NÚT ĐIỀU HƯỚNG DÙNG CHUNG ---
    const renderNavigationButton = () => {
        const isAuth = localStorage.getItem('token');
        return (
            <button 
                onClick={() => navigate(isAuth ? '/' : '/login')} 
                style={{ 
                    marginTop: '15px', 
                    width: '100%', 
                    padding: '16px', 
                    backgroundColor: '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(108, 117, 125, 0.2)',
                    transition: '0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
                {isAuth ? '🏠 Trở về Trang chủ' : '🔑 Đi đến Đăng nhập'}
            </button>
        );
    };

    // 1. Giao diện khi đang tải hoặc BỊ LỖI
    if (!recordInfo) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', padding: '0 20px' }}>
                <h3 style={{ color: error ? '#dc3545' : '#0056b3', textAlign: 'center', marginBottom: '30px' }}>
                    {status}
                </h3>
                {/* Chỉ hiện nút khi đã xử lý xong và có lỗi */}
                {error && (
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        {renderNavigationButton()}
                    </div>
                )}
            </div>
        );
    }

    // 2. Giao diện thẻ Báo cáo sức khỏe khi THÀNH CÔNG
    return (
        <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
            <div 
                id="health-report-card" 
                style={{ 
                    padding: '30px', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '12px', 
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#2c3e50', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                        Phiếu Phân Tích Sức Khỏe
                    </h2>
                    <p style={{ color: '#7f8c8d', margin: 0 }}>Hệ thống Cân điện tử thông minh IoT</p>
                    <p style={{ color: '#7f8c8d', margin: '5px 0 0 0', fontSize: '14px' }}>
                        Thời gian đo: <strong>{recordInfo.date || new Date().toLocaleString('vi-VN')}</strong>
                    </p>
                </div>
                
                <hr style={{ border: 'none', borderTop: '2px dashed #eee', marginBottom: '20px' }} />
                
                <h4 style={{ color: '#34495e', marginBottom: '15px' }}>1. Chỉ số Thể hình (Hình thái)</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', marginBottom: '25px' }}>
                    <tbody>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}><strong>Chiều cao</strong></td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>{recordInfo.height} cm</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}><strong>Cân nặng</strong></td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>{recordInfo.weight} kg</td>
                        </tr>
                        <tr style={{ backgroundColor: '#e8f4f8' }}>
                            <td style={{ padding: '12px', borderBottom: '2px solid #bce8f1', color: '#31708f' }}><strong>Chỉ số BMI</strong></td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #bce8f1', fontWeight: 'bold', color: '#31708f', fontSize: '18px' }}>
                                {recordInfo.bmi}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h4 style={{ color: '#34495e', marginBottom: '15px' }}>2. Chỉ số Sinh tồn (Y tế)</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
                    <tbody>
                        <tr style={{ backgroundColor: '#fcf8e3' }}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #faebcc', color: '#8a6d3b' }}><strong>Thân nhiệt</strong></td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #faebcc', fontWeight: 'bold', color: '#8a6d3b' }}>
                                {recordInfo.temperature} °C
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}><strong>Nhịp tim (Heart Rate)</strong></td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #dee2e6', fontWeight: 'bold', color: '#d9534f' }}>
                                {recordInfo.heart_rate} bpm
                            </td>
                        </tr>
                        <tr style={{ backgroundColor: '#dff0d8' }}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #d6e9c6', color: '#3c763d' }}><strong>Nồng độ oxy máu (SpO2)</strong></td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #d6e9c6', fontWeight: 'bold', color: '#3c763d' }}>
                                {recordInfo.spo2} %
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ marginTop: '35px', padding: '20px', backgroundColor: '#f1f3f5', borderRadius: '8px', borderLeft: '5px solid #007bff' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#0056b3' }}>💡 Đánh giá & Khuyến nghị:</h4>
                    {generateHealthAdvice(recordInfo).map((line, index) => (
                        <p key={index} style={{ margin: '0 0 10px 0', lineHeight: '1.6', fontSize: '15px', color: '#495057' }}>
                            {line}
                        </p>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '25px' }}>
                <button 
                    onClick={handleExportPDF} 
                    style={{ 
                        width: '100%', 
                        padding: '16px', 
                        backgroundColor: '#198754', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(25, 135, 84, 0.2)',
                        transition: '0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#157347'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#198754'}
                >
                    📥 Tải xuống Phiếu kết quả (PDF)
                </button>
                
                {renderNavigationButton()}
            </div>
        </div>
    );
};

export default ClaimRecord;