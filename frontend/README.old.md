<<<<<<< HEAD
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
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> e8cfb7c (Initialize project using Create React App)
