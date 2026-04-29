## Hướng dẫn cài đặt và chạy trên Windows

Dự án này bao gồm hai phần chính: **Backend (Django)** và **Frontend (React)**.

### 1. Yêu cầu hệ thống
* Đã cài đặt [Python](https://www.python.org/downloads/) (phiên bản 3.10 trở lên).
* Đã cài đặt [Node.js](https://nodejs.org/) (bao gồm npm).
* Đã cài đặt [Git](https://git-scm.com/).

---

### 2. Thiết lập Backend (Django)
Mở terminal (PowerShell hoặc Command Prompt) tại thư mục gốc của dự án:

1. **Di chuyển vào thư mục dự án:**
   ```bash
   cd smart-scale-project
   ```
2. **Tạo môi trường ảo (venv):**
   ```bash
   python -m venv venv
   ```
3. **Kích hoạt môi trường ảo:**
   ```bash
   .\venv\Scripts\activate
   ```
4. **Cài đặt các thư viện cần thiết:**
   ```bash
   pip install -r backend/requirements.txt
   ```
5. **Chạy server Backend:**
   ```bash
   python manage.py runserver
   ```
   *Server sẽ chạy tại địa chỉ: `http://127.0.0.1:8000/`*

---

### 3. Thiết lập Frontend (React)
Mở một cửa sổ terminal mới (vẫn đứng tại thư mục gốc dự án):

1. **Di chuyển vào thư mục frontend:**
   ```bash
   cd frontend
   ```
2. **Cài đặt các gói thư viện (node_modules):**
   ```bash
   npm install
   ```
3. **Chạy ứng dụng React:**
   ```bash
   npm start
   ```
   *Ứng dụng sẽ tự động mở tại: `http://localhost:3000/`*
