import paho.mqtt.client as mqtt
import json
import time
import threading
import random

# Cấu hình
BROKER = "broker.hivemq.com"
PORT = 1883
TOPIC = "smart_scale/kiosk_01/data"
NUM_DEVICES = 20

def calculate_bmi(weight, height_cm):
    height_m = height_cm / 100.0
    return round(weight / (height_m * height_m), 1)

def simulate_device(device_id):
    client = mqtt.Client(client_id=f"kiosk_load_test_{device_id}")
    try:
        client.connect(BROKER, PORT, 60)
        client.loop_start()
        
        while True:
            # Tạo dữ liệu ngẫu nhiên
            weight = round(random.uniform(50, 90), 1)
            height = 170.0
            bmi = calculate_bmi(weight, height)
            
            payload = {
                "weight": weight,
                "height": height,
                "bmi": bmi,
                "temperature": round(random.uniform(36, 37.5), 1),
                "heart_rate": random.randint(60, 100),
                "spo2": random.randint(95, 100),
                "mac_address": f"AA:BB:CC:00:00:{device_id:02x}"
            }
            
            client.publish(TOPIC, json.dumps(payload))
            print(f"[Thiết bị {device_id}] BMI={bmi} | Gửi dữ liệu thành công!")
            time.sleep(5) 
            
    except Exception as e:
        print(f"Lỗi thiết bị {device_id}: {e}")

if __name__ == "__main__":
    print(f"🚀 Bắt đầu giả lập {NUM_DEVICES} thiết bị với BMI tự động...")
    for i in range(NUM_DEVICES):
        t = threading.Thread(target=simulate_device, args=(i,))
        t.start()
        time.sleep(0.5)