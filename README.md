# 💼 Recruitment Management System (Backend)

This repository contains the **backend service** of a recruitment management system, developed with **NestJS, TypeScript, and MongoDB**.

The backend provides RESTful APIs for authentication, role-based access control, company management, job management, resume management, and user administration, serving a separate frontend application.

---

## 🌐 Deployment

The project is deployed using cloud services:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

---

## 🚀 Live Demo

### Frontend

👉 https://project-recruitment-website.vercel.app

### Backend API

👉 https://project-recruitment-website.onrender.com

---

## 🔑 Demo Account

| Role      | Email               | Password |
| --------- | ------------------- | -------- |
| **Admin** | `admin@gmail.com` | `123456` |
| **User**  | `user@gmail.com`  | `123456` |

---

## 🛠 Tech Stack

### Backend

* NestJS
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* Passport.js
* Multer

### Deployment

* Render
* Vercel
* MongoDB Atlas

---

## 🏗 Architecture

The backend follows a modular architecture provided by NestJS.

Main modules include:

* Authentication
* User Management
* Company Management
* Job Management
* Resume Management
* Permission & Role Management
* File Upload

---

## ✨ Features

### 👤 User Features

* Register and log in securely
* Browse available job listings
* Search and filter jobs
* View company information
* Submit resumes for job applications
* Manage personal profile

### 🏢 Admin Features

* Role-based access control (RBAC)
* Manage users and permissions
* Create, update, and delete companies
* Create, update, and delete job postings
* Review submitted resumes
* Upload and manage company logos or related files

---

## 🔒 Security

* JWT-based authentication
* Password hashing with bcrypt
* Role-based authorization
* Request validation using DTOs
* MongoDB ObjectId validation
* Protected API endpoints

---

## ⚙️ Installation (Run Locally)

### 1. Clone the repository

```bash
git clone  https://github.com/kieuduc11/Project-Recruitment_Website
cd Project-Recruitment_Website
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=8000
MONGO_URL=your_mongodb_connection_string

#SET UP ACCESS TOKEN
JWT_ACCESS_SECRET=your_secret
JWT_ACCESS_EXPIRE=15m

#SET UP REFRESH TOKEN
JWT_REFRESH_SECRET=your_secret
JWT_REFRESH_EXPIRE=7d

#init sample data
SHOULD_INIT=true
INIT_PASSWORD=123456
```

### 4. Run the backend

```bash
npm run start:dev
```

---

## 📜 Available Scripts

```bash
npm run start:dev     # Development mode
npm run build         # Build project
npm run start:prod    # Production mode
```

---

## 📄 License

This project was developed for educational and portfolio purposes.
