import json
import uuid
import paho.mqtt.client as mqtt
from django.core.management.base import BaseCommand
from django.conf import settings
from biometrics.models import MeasurementSession

class Command(BaseCommand):
    help = 'Khởi chạy Background Worker lắng nghe MQTT'

    def handle(self, *args, **options):
        # Cấu hình MQTT Broker
        MQTT_BROKER = "broker.hivemq.com"
        MQTT_PORT = 1883
        TOPIC_RECEIVE = "smart_scale/kiosk_01/data"
        TOPIC_RESPONSE = "smart_scale/kiosk_01/qr_response"

        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                self.stdout.write(self.style.SUCCESS(f" Đã kết nối MQTT Broker! (Mã lỗi: {rc})"))
                client.subscribe(TOPIC_RECEIVE)
                self.stdout.write(f" Đang lấy dữ liệu tại Topic: {TOPIC_RECEIVE}")
            else:
                self.stdout.write(self.style.ERROR(f" Kết nối thất bại, mã lỗi: {rc}"))

        def on_message(client, userdata, msg):
            payload = msg.payload.decode('utf-8')
            self.stdout.write(f"\n [CÓ TÍN HIỆU MỚI] Dữ liệu từ {msg.topic}: {payload}")

            try:
                # 1. Giải mã gói tin JSON từ ESP32
                data = json.loads(payload)
                mac_address = data.get('mac_address')
                weight = data.get('weight')
                height = data.get('height')
                # Tính toán BMI nếu chưa có trong dữ liệu
                bmi = data.get('bmi')
                if bmi is None and weight and height:
                    height_m = height / 100.0  # Đổi cm sang mét
                    bmi = round(weight / (height_m * height_m), 1)
                
                # 2. Xử lý Logic Database
                session_uuid = uuid.uuid4()
                
                MeasurementSession.objects.create(
                    token=session_uuid,
                    mac_address=mac_address,
                    weight=weight,
                    height=height,
                    bmi=bmi,
                    temperature=data.get('temperature'),
                    heart_rate=data.get('heart_rate'),
                    spo2=data.get('spo2'),
                    is_saved=False
                )
                self.stdout.write(self.style.SUCCESS(f" Đã lưu dữ liệu tạm vào Database. UUID: {session_uuid}"))

                # 3. Tạo Link xác nhận QR Code
                FRONTEND_URL = "http://localhost:3000"
                qr_url = f"{FRONTEND_URL}/claim-record/{session_uuid}"

                # 4. Đóng gói JSON & Trả ngược URL về cho ESP32 để vẽ mã QR
                response_data = {
                    "status": "success",
                    "qr_url": qr_url
                }
                client.publish(TOPIC_RESPONSE, json.dumps(response_data))
                
                self.stdout.write(self.style.SUCCESS(f" Đã trả QR URL về cho Kiosk: {qr_url}"))

            except json.JSONDecodeError:
                self.stdout.write(self.style.ERROR(" LỖI: Gói tin gửi lên không đúng chuẩn JSON!"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f" LỖI HỆ THỐNG: {str(e)}"))

        # Khởi tạo Client và gắn hàm xử lý sự kiện
        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message

        self.stdout.write(self.style.WARNING("⏳ Đang kết nối tới MQTT Broker..."))
        client.connect(MQTT_BROKER, MQTT_PORT, 60)

        # Chạy vòng lặp vĩnh cửu để giữ chương trình luôn thức
        try:
            client.loop_forever()
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING("\n Đã tắt hệ thống lắng nghe MQTT."))