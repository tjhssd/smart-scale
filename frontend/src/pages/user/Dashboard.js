import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Thermometer, Activity, Droplets, Ruler, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import StatCard from '../../components/StatCard';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function Dashboard() {
  const [data, setData] = useState({ 
    weight: 0, heart_rate: 0, spo2: 0, temperature: 0, height: 0, bmi: 0 
  });
  const [historyList, setHistoryList] = useState([]);
  const [targetWeight, setTargetWeight] = useState();

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      // 1. Lấy dữ liệu hồ sơ để có cân nặng mục tiêu
      const profileRes = await axios.get(`${API_BASE_URL}/api/profile/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      const tw = profileRes.data.targetWeight ?? profileRes.data.target_weight;
      if (tw) {
        setTargetWeight(Number(tw));
      }

      // 2. Lấy lịch sử đo
      const res = await axios.get(`${API_BASE_URL}/api/records/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      
      if (res.data.length > 0) {
        const processed = res.data.map(item => ({
          ...item,
          bmi: parseFloat((item.weight / Math.pow(item.height / 100, 2)).toFixed(1)),
          timeLabel: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setData(processed[0]); 
        setHistoryList(processed);
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu Dashboard", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getBmiStatus = (bmi) => {
    if (bmi === 0) return "--";
    if (bmi < 18.5) return "Gầy";
    if (bmi < 24.9) return "Bình thường";
    return "Thừa cân";
  };

  const chartData = [...historyList].reverse().slice(-10);

  return (
    <div className="page-content anim-fade">
      <h2 className="section-title">CHỈ SỐ SINH HIỆU</h2>
      <div className="stats-row">
        <StatCard label="NHIỆT ĐỘ" value={data.temperature} unit="°C" color="#ef4444" icon={<Thermometer size={14}/>}/>
        <StatCard label="NHỊP TIM" value={data.heart_rate} unit="bpm" color="#ec4899" icon={<Activity size={14}/>}/>
        <StatCard label="SPO2" value={data.spo2} unit="%" color="#06b6d4" icon={<Droplets size={14}/>}/>
      </div>

      <h2 className="section-title">THỂ TRẠNG & BMI</h2>
      <div className="stats-row">
        <StatCard label="CHIỀU CAO" value={data.height} unit="cm" color="#3b82f6" icon={<Ruler size={14}/>}/>
        <StatCard label="CÂN NẶNG" value={data.weight} unit="kg" color="#10b981" icon={<Scale size={14}/>}/>
        <div className="bmi-card">
            <span className="bmi-label">BMI</span>
            <div className="bmi-value">{data.bmi || 0}</div>
            <span className={`bmi-status ${getBmiStatus(data.bmi)}`}>{getBmiStatus(data.bmi)}</span>
        </div>
      </div>

      <h2 className="section-title">XU HƯỚNG THEO DÕI</h2>
      <div className="chart-section">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="timeLabel" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{borderRadius:'10px', border:'none', boxShadow:'0 5px 15px rgba(0,0,0,0.1)'}} />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            
            <Line type="monotone" dataKey="bmi" stroke="#6366f1" strokeWidth={4} name="BMI" dot={{r:4, fill:'#6366f1'}} />
            <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={4} name="Cân nặng" dot={{r:4, fill:'#10b981'}} />

            <ReferenceLine
              y={targetWeight}
              stroke="#ff7300"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: `Mục tiêu: ${targetWeight}kg`, position: 'right', fill: '#ff7300', fontSize: 11 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}