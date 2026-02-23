# 🚀 Backend Assignment – Scalable REST API

## 📌 Overview

This project is a scalable RESTful API built using **Node.js, Express, and MongoDB**.  
It implements secure authentication, role-based access control, and CRUD operations for tasks.

The system supports two roles:
- 👤 User
- 👑 Admin

Admin users can access all tasks, while regular users can only manage their own tasks.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication (Access + Refresh Tokens)
- bcrypt (Password Hashing)
- Cookie-based authentication
- Postman (API Documentation)

---

## 📂 Project Structure
``src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
└── app.js
``

---

## 🔐 Features Implemented

### ✅ Authentication
- User Registration (with hashed passwords)
- Login with JWT (Access + Refresh Token)
- Logout
- Refresh Access Token
- Get Current User

### ✅ Role-Based Access
- `role` field in User model (`user` | `admin`)
- Admin can view all tasks
- Users can only access their own tasks

### ✅ Task CRUD
- Create Task
- Get Tasks
- Update Task
- Delete Task

### ✅ Security Practices
- Password hashing using bcrypt
- httpOnly cookies for JWT
- Centralized error handling
- Input validation
- Ownership validation for updates/deletes

### ✅ API Versioning
/api/v1/


---

## ⚙️ Environment Variables
``
Create a `.env` file in root:
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
``

---

## 🚀 Installation & Setup

```bash
git clone https://github.com/satakshi003/Backend_Assignment
cd backend
npm install
npm run dev
Server runs on:
http://localhost:8000


##  API Documentation

Postman collection included:
Backend-Assignment-API.postman_collection.json
Import into Postman to test all APIs.

🧠 Scalability Design Notes
This system is designed with scalability in mind:

🔹 Stateless JWT authentication (supports horizontal scaling)
🔹 Versioned APIs (/api/v1)
🔹 Modular folder structure (controllers, routes, services)
🔹 Centralized error handling middleware
🔹 Role-based access logic separated from controllers

🔮 Future Scalability Enhancements
Redis caching for frequently accessed tasks
Load balancing with multiple server instances
Docker containerization
Microservice separation (Auth service, Task service)
Rate limiting & API throttling

## 👑 Admin Access
Admin users are created by updating the role field in the database:
"role": "admin"
Admin users:
Can view all tasks
Can delete/update any task
