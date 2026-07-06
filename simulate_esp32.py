import requests
import random
import time
import socket
import qrcode

def get_local_ip():
    """Logic 1: Tự động lấy địa chỉ IP LAN của máy tính đang chạy code"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Kết nối ảo ra một DNS ngoài mạng để ép máy tính lộ IP thật trong LAN
        s.connect(("8.8.8.8", 80)) 
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

# Tự động gán IP vào URL của Backend
LOCAL_IP = get_local_ip()
API_URL = f"http://{LOCAL_IP}:8000/api/hardware-upload/"

def generate_mock_data():
    weight = round(random.uniform(50.0, 85.0), 1)
    height = round(random.uniform(155.0, 185.0), 1)
    return {
        "weight": weight,
        "height": height,
        "bmi": round(weight / ((height/100) ** 2), 1),
        "temperature": round(random.uniform(36.1, 37.5), 1),
        "heart_rate": random.randint(60, 100),
        "spo2": random.randint(95, 100),
        "mac_address": "AA:BB:CC:DD:EE:FF"
    }

def simulate_hardware_and_show_qr():
    print("BẮT ĐẦU GIẢ LẬP TRẠM CÂN VÀ TẠO MÃ QR...")
    time.sleep(1)
    
    data = generate_mock_data()
    print(f"Đang gửi dữ liệu tới API: {API_URL}")
    
    try:
        response = requests.post(API_URL, json=data, timeout=5)
        
        if response.status_code == 201:
            # Lấy URL do Backend trả về
            original_qr_url = response.json().get('qr_url')
            
            # Logic 2: Ép URL này sử dụng IP LAN thay vì 'localhost' 
            # (Rất quan trọng để điện thoại có thể truy cập được Web React trên máy tính)
            final_qr_url = original_qr_url.replace("localhost", LOCAL_IP).replace("127.0.0.1", LOCAL_IP)
            
            print("\n[THÀNH CÔNG] Backend đã ghi nhận. Đang tiến hành vẽ ảnh QR...")
            print(f"Link nạp vào QR: {final_qr_url}")
            
            # Logic 3: Vẽ và hiển thị ảnh QR Code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(final_qr_url)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            
            print("\n  DÙNG ĐIỆN THOẠI QUÉT MÃ QR VỪA HIỆN RA TRÊN MÀN HÌNH!")
            # Lệnh này sẽ tự động gọi trình xem ảnh mặc định của Windows/Mac để bật ảnh lên
            img.show() 
            
        else:
            print(f"\n[LỖI] Máy chủ từ chối. Mã lỗi: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print(f"\n[LỖI MẠNG] Không thể kết nối tới {API_URL}.")
        print("LƯU Ý QUAN TRỌNG: Bạn phải chạy Backend Django bằng lệnh sau để điện thoại quét được:")
        print("python manage.py runserver 0.0.0.0:8000")

if __name__ == "__main__":
    simulate_hardware_and_show_qr()