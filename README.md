# Smart-Medical-Inventory
# 🏥 Smart Medical Inventory & Transfer System

### 💊 Intelligent Platform for Medicine & Surgical Instrument Distribution  
A modern web-based system that automates **medicine inventory, order management, and transfer tracking** between medical stores and distributors in **Chhatrapati Sambhajinagar**.  
Built using **Node.js**, **MongoDB**, and **Razorpay**, it ensures smooth, transparent, and secure medical supply operations.

---

## 🌟 Key Highlights

✅ Real-time medicine and instrument management  
✅ Secure online payments (Razorpay Integration)  
✅ Role-based authentication (Admin, Store, Distributor)  
✅ Transparent order approval & transfer process  
✅ Interactive Admin Dashboard  
✅ Built for automation and scalability  

---

## ⚙️ Tech Stack Overview

| Category | Technologies Used |
|-----------|-------------------|
| **Frontend** | HTML, CSS, JavaScript, React (LWC/Experience Cloud) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Cloud Platform** | Salesforce Experience Cloud |
| **Payment Gateway** | Razorpay |
| **Authentication** | JWT, bcrypt password hashing |
| **Version Control** | Git & GitHub |
| **Hosting** | Salesforce Cloud / Local Environment |

---

## 🏗️ Project Architecture

Smart-Medical-Inventory/
│
├── frontend/ # Frontend user interface (HTML, CSS, JS)
│ ├── assets/ # Images, logos, and UI icons
│ ├── pages/ # Web pages (Home, Orders, Login, etc.)
│ ├── scripts/ # JS logic for UI and API calls
│ └── styles/ # CSS styling
│
├── nodeBackend/ # Backend API using Node.js & Express
│ ├── models/ # MongoDB data schemas
│ ├── routes/ # API endpoints
│ ├── controllers/ # Business logic
│ ├── config/ # Database & environment configuration
│ ├── middleware/ # JWT auth & validation
│ ├── utils/ # Helper functions
│ └── server.js # Entry point of the backend server
│
├── .gitignore # Ignore node_modules, env files, logs
├── package.json # Node dependencies
├── package-lock.json
└── README.md # Project documentation

yaml
Copy code

---

## ⚡ Features in Detail

### 🏬 For Medical Stores
- Browse available medicines & instruments  
- Place and manage new orders  
- View live order status (Pending, Approved, Delivered)  
- Make payments securely via **Razorpay**  
- Download invoices after delivery  

### 🧑‍💼 For Distributors / Admin
- Add, edit, and delete medicine & surgical products  
- Manage inventory and stock levels  
- Approve or reject store orders  
- Monitor transfer activity and generate reports  
- Access real-time sales and stock analytics  

### 💳 Payment & Transaction
- Secure Razorpay integration  
- API-based order creation and payment verification  
- Post-payment order updates in MongoDB  
- Automatic email/SMS notification (optional future enhancement)

---

## 🧠 How It Works (Workflow)

1. **User (Medical Store)** logs in or registers via the Experience Cloud portal.  
2. **Store** browses the available medicines/instruments.  
3. When an order is placed, it is stored in MongoDB and marked as *Pending*.  
4. **Distributor/Admin** reviews and approves/rejects the order.  
5. Once approved, the **store completes payment via Razorpay**.  
6. **Delivery status** updates automatically, and the order is marked *Delivered*.  

---

## 🧩 Setup & Installation

### 🔹 Prerequisites
Make sure you have the following installed:
- Node.js (v16 or above)
- MongoDB
- Git
- Salesforce Developer Org (for Experience Cloud setup)

---
