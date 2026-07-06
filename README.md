Hướng dẫn cài đặt và chạy trên Windows
Dự án này bao gồm hai phần chính: Backend (Django) và Frontend (React). Để chạy được tính năng quét mã QR bằng điện thoại, yêu cầu điện thoại và máy tính phải kết nối cùng một mạng Wi-Fi.

1. Yêu cầu hệ thống
Đã cài đặt Python (phiên bản 3.10 trở lên).

Đã cài đặt Node.js (bao gồm npm).

Đã cài đặt Git.

2. Thiết lập Backend (Django)
Mở terminal (PowerShell hoặc Command Prompt) tại thư mục gốc của dự án:

Di chuyển vào thư mục dự án:

Bash
cd smart-scale-project
Tạo môi trường ảo (venv):

Bash
python -m venv venv
Kích hoạt môi trường ảo:

Bash
.\venv\Scripts\activate
Cài đặt các thư viện cần thiết:

Bash
pip install -r backend/requirements.txt
Chạy server Backend (Chế độ cho phép kết nối từ mạng LAN):

Bash
python manage.py runserver 0.0.0.0:8000
⚠️ QUAN TRỌNG: Ở lần chạy đầu tiên, nếu Windows Defender Firewall hiện lên bảng cảnh báo bảo mật (Windows Security Alert), hãy tích chọn cả mạng Public/Private và bấm Allow access. Nếu không, điện thoại của bạn sẽ không thể quét được mã QR.

3. Thiết lập Frontend (React)
Mở một cửa sổ terminal mới (vẫn đứng tại thư mục gốc dự án):

Di chuyển vào thư mục frontend:

Bash
cd frontend
Cài đặt các gói thư viện (node_modules):

Bash
npm install
Chạy ứng dụng React:

Bash
npm start
Ứng dụng sẽ tự động mở trên máy tính tại: http://localhost:3000/

4. Chạy kịch bản Demo (Mô phỏng trạm cân IoT)
Sau khi cả Backend và Frontend đều đang chạy, hãy mở cửa sổ terminal thứ 3 tại thư mục gốc của dự án để chạy giả lập gửi dữ liệu và sinh mã QR.

Kích hoạt lại môi trường ảo (Bắt buộc):

Bash
.\venv\Scripts\activate
Cài đặt thư viện vẽ QR Code (Nếu báo lỗi chưa có thư viện):

Bash
pip install qrcode pillow
Chạy kịch bản gửi dữ liệu:

Bash
python send_virtual_data.py