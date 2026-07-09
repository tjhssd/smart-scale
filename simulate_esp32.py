import paho.mqtt.client as mqtt
import json
import random
import time
import socket
import qrcode

# ================= CẤU HÌNH MQTT BROKER =================
BROKER = "broker.hivemq.com"
PORT = 1883
TOPIC_PUB = "smart_scale/kiosk_01/data"
TOPIC_SUB = "smart_scale/kiosk_01/qr_response" 

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80)) 
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

LOCAL_IP = get_local_ip()

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

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("[+] Kết nối MQTT Broker thành công!")
        
        # 1. Đăng ký lắng nghe phản hồi từ Backend ngay khi vừa kết nối
        client.subscribe(TOPIC_SUB)
        print(f"[*] Đang lắng nghe phản hồi tại topic: {TOPIC_SUB}")
        
        # 2. Tạo dữ liệu sinh hiệu ngẫu nhiên
        data = generate_mock_data()
        print("\n[*] Đang đẩy dữ liệu sinh hiệu ngẫu nhiên lên Broker...")
        print(json.dumps(data, indent=2))
        
        # 3. Đẩy dữ liệu (Tương đương với POST)
        client.publish(TOPIC_PUB, json.dumps(data))
    else:
        print(f"[-] Kết nối thất bại, Mã lỗi: {rc}")

def on_message(client, userdata, msg):
    print("\n[!] NHẬN ĐƯỢC PHẢN HỒI TỪ BACKEND:")
    data_str = msg.payload.decode("utf-8")
    
    try:
        response_data = json.loads(data_str)
        original_qr_url = response_data.get("qr_url") 
        
        if original_qr_url:
            final_qr_url = original_qr_url.replace("localhost", LOCAL_IP).replace("127.0.0.1", LOCAL_IP)
            
            print(f"[+] Link nạp vào QR: {final_qr_url}")
            print("[*] Đang tiến hành vẽ ảnh QR...")
            
            # Vẽ và hiển thị ảnh QR Code bằng trình xem ảnh mặc định
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(final_qr_url)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            
            print("\n📱 DÙNG ĐIỆN THOẠI QUÉT MÃ QR VỪA HIỆN RA TRÊN MÀN HÌNH!")
            img.show() 
            
            # Hoàn thành 1 vòng đời
            print("[+] Hoàn tất phiên đo. Đang ngắt kết nối...")
            client.disconnect()
            
        else:
            print("[-] Lỗi: Không tìm thấy trường 'qr_url' trong gói tin phản hồi.")
            client.disconnect()
            
    except Exception as e:
        print(f"[-] Lỗi giải mã phản hồi từ Backend: {e}")
        client.disconnect()

def simulate_hardware_mqtt():
    print("=== BẮT ĐẦU GIẢ LẬP TRẠM CÂN BẰNG MQTT ===")
    
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(BROKER, PORT, 60)
        client.loop_forever() 
    except Exception as e:
        print(f"[-] Không thể kết nối tới MQTT Broker. Lỗi: {e}")

if __name__ == "__main__":
    simulate_hardware_mqtt()