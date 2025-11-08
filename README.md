<h1 align="center">🏥 Smart Medical Inventory & Transfer System</h1>

<p align="center">
  <strong>Automating medical inventory, order management, and distribution using Salesforce, Node.js, and MongoDB.</strong><br>
  <em>Developed for efficient medicine transfer between distributors and medical stores in Chhatrapati Sambhajinagar.</em>
</p>

---

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Backend-Node.js-green?logo=node.js&logoColor=white"></a>
  <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb&logoColor=white"></a>
  <a href="https://developer.salesforce.com"><img src="https://img.shields.io/badge/Cloud-Salesforce-blue?logo=salesforce&logoColor=white"></a>
  <a href="https://razorpay.com"><img src="https://img.shields.io/badge/Payment-Razorpay-lightblue?logo=razorpay&logoColor=white"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
</p>

---

## 📘 Overview

The **Smart Medical Inventory & Transfer System** is a cloud-integrated web solution designed to modernize the way medicines and surgical instruments are managed, ordered, and transferred.  
It connects **medical stores** and **distributors** through a unified platform powered by **Salesforce Experience Cloud**, **Node.js**, **Express.js**, and **MongoDB** — delivering efficiency, traceability, and real-time automation.

---

## 🧩 Key Features

### 🏬 For Medical Stores
- Browse available medicines and instruments in real-time  
- Place orders and track their approval status  
- Secure online payments via Razorpay  
- Generate and download invoices  

### 🏢 For Distributors / Admin
- Add, update, and manage product inventory  
- Approve or reject store orders  
- Monitor order history and transfer logs  
- Dashboard analytics for sales and stock insights  

### 💳 For Both Users
- Safe transactions using Razorpay APIs  
- Role-based login with JWT authentication  
- Password encryption with bcrypt  
- Clean and responsive UI  

---

## 🧱 System Architecture

Smart-Medical-Inventory/
│
├── frontend/ # Client-side code (HTML, CSS, JS)
│ ├── assets/ # Images and icons
│ ├── pages/ # UI pages (home, login, order, etc.)
│ └── scripts/ # Frontend logic and API calls
│
├── nodeBackend/ # Node.js backend server
│ ├── config/ # Database & environment setup
│ ├── controllers/ # Business logic and validation
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API endpoints
│ ├── middleware/ # Authentication middleware
│ └── server.js # Backend entry point
│
├── .gitignore # Ignore unnecessary files (node_modules, env)
├── package.json
├── README.md
└── LICENSE

yaml
Copy code

---

## ⚙️ Installation & Setup

### 🔹 Clone the Repository
```bash
git clone https://github.com/Rahulkhaire/Smart-Medical-Inventory.git
cd Smart-Medical-Inventory
🔹 Backend Setup
bash
Copy code
cd nodeBackend
npm install
Create a .env file inside nodeBackend/:

env
Copy code
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical_inventory
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
Run the backend:

bash
Copy code
npm run dev
🔹 Frontend Setup
bash
Copy code
cd ../frontend
npm install
npm start
Now visit 👉 http://localhost:3000

💰 Razorpay Integration
The payment API /api/payment/create-order creates secure orders on Razorpay.

After payment success, the backend verifies the signature for authenticity.

Each transaction is stored in MongoDB with order and user details.

Refunds and transaction history can be managed in the dashboard.

🧠 Data Flow Diagram
css
Copy code
[Medical Store] → [Frontend] → [Backend API] → [MongoDB]
       ↓                                   ↑
   [Payment via Razorpay] ← [Transaction Verification]
📊 Admin Dashboard Insights
Total Orders & Revenue

Pending Deliveries

Stock Summary by Category

Top Selling Medicines

Real-time Analytics Graphs (Future enhancement)

🔒 Security Practices
JWT-based user authentication

Encrypted passwords using bcrypt

Environment variable protection via .env

CORS enabled for secure client-server communication

🚀 Future Roadmap
Feature	Description	Status
AI-based stock forecasting	Predicts inventory demand automatically	🔜 Planned
QR code order tracking	Track physical delivery using QR	🔜 Planned
Multi-language support	English, Marathi, Hindi	⏳ In progress
PDF invoice generation	Automated digital invoices	✅ Completed
Email/SMS notifications	Real-time order updates	🔜 Planned

👨‍💻 Developer
Rahul Khaire
🎓 B.Tech – AI & Data Science, MIT (Batch 2026)
🚀 Salesforce Student Community Lead | Google Cloud Lead (2024–25)
🏅 Salesforce AI Associate | Oracle AI Foundations | GitHub Certified

📧 Email: rahulkhaire@example.com
🌐 GitHub: @Rahulkhaire
💼 LinkedIn: linkedin.com/in/rahulkhaire

🪪 License
This project is licensed under the MIT License.
See the LICENSE file for details.

⭐ Support & Contribution
If this project helps you, please ⭐ star the repository to show your support.
Contributions are welcome — just fork the repo, create a feature branch, and open a pull request.

📷 Screenshots (Add your own)
Dashboard	Order Page	Payment Gateway

<h3 align="center">💡 “Transforming Healthcare Logistics with Smart Automation.”</h3> ```
