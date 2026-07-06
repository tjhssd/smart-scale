import requests
import random
import time

API_URL = "http://127.0.0.1:8000/api/hardware-upload/"

def generate_mock_data():
    weight = round(random.uniform(50.0, 85.0), 1)
    height = round(random.uniform(155.0, 185.0), 1)
    return {
        "weight": weight,
        "height": height,
        "bmi": round(weight / ((height/100) ** 2), 1),
        "temperature": 36.5,
        "heart_rate": 80,
        "spo2": 98,
        "mac_address": "WIFI:TEST:03"
    }

def simulate_unstable_network():
    print("BẮT ĐẦU KIỂM THỬ BIẾN ĐỘNG MẠNG (KỊCH BẢN 3)...\n")
    
    for i in range(1, 4): # Chạy thử 3 lần với 3 tình trạng mạng khác nhau
        print(f"--- Lần thử {i} ---")
        data = generate_mock_data()
        
        # Giả lập ngẫu nhiên 3 tình trạng mạng
        network_condition = random.choice(['TỐT', 'YẾU', 'RỚT_MẠNG'])
        
        if network_condition == 'TỐT':
            print("Sóng Wi-Fi Tốt. Đang gửi gói tin...")
            delay = random.uniform(0.1, 0.3) # Trễ 100-300ms
            
        elif network_condition == 'YẾU':
            delay = random.uniform(2.5, 4.0) # Trễ 2.5 - 4 giây
            print(f"Sóng Wi-Fi Yếu. Băng thông bị bóp!")
            print(f"Đang cố gắng đẩy dữ liệu... (Dự kiến trễ {round(delay*1000)}ms)")
            
        else:
            print("Mất kết nối Wi-Fi đột ngột (Connection Drop)!")
            time.sleep(2)
            print("Phần cứng đang kích hoạt Auto-Reconnect...")
            time.sleep(3)
            print("Đã kết nối lại thành công. Tiến hành gửi lại dữ liệu bị kẹt...")
            delay = random.uniform(0.2, 0.5)

        time.sleep(delay) # Áp dụng độ trễ mô phỏng
        
        # Bắt đầu tính thời gian phản hồi thực tế (Ping)
        start_time = time.time()
        try:
            response = requests.post(API_URL, json=data, timeout=5)
            actual_ping = round((time.time() - start_time) * 1000)
            
            if response.status_code == 201:
                print(f"[THÀNH CÔNG] Máy chủ đã nhận an toàn. Ping thực tế: {actual_ping}ms\n")
        except requests.exceptions.RequestException:
            print("[LỖI] Time-out! Không thể kết nối tới Server.\n")
            
        time.sleep(3) # Nghỉ 3 giây trước lần test tiếp theo

if __name__ == "__main__":
    simulate_unstable_network()