# 🧑‍💼 Employee Leave Management System – Backend

🔗 **Live Demo (Frontend):** [https://employee-leave-management-frontend.vercel.app/login](https://employee-leave-management-frontend.vercel.app/login)

This is the **backend** of the Employee Leave Management System built using **Node.js**, **Express**, and **MySQL**. It provides RESTful APIs for managing departments, employees, leave types, leave applications, and role-based access.

---

## 🚀 Features

- JWT Authentication (Admin & Employee)
- Admin CRUD operations for:
  - Departments
  - Employees
  - Leave Types
  - Leave Application Review
- Employee:
  - Leave Application
  - View Leave History
  - Profile View & Update
- Middleware to protect API access
- Role-based access control
- Hosted and deployable via Vercel

---

## 📁 Folder Structure

```
backend/
├── controllers/
├── middlewares/
├── routes/
├── db.js
├── index.js
├── .env
└── package.json
```

---

## ⚙️ Installation & Running Locally

1. Clone the repo:

```bash
git clone https://github.com/your-username/employee-leave-management-backend.git
cd employee-leave-management-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure `.env` file:

```env
PORT=5000
DATABASE_URL=mysql://user:password@localhost:3306/leave_management_db
JSON_TOKEN=your_jwt_secret
```

4. Start the server:

```bash
npm start
```

Server runs on: [http://localhost:5000](http://localhost:5000)

---

## 🌐 API Endpoints

| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| POST   | /api/auth/login          | Admin Login                    |
| POST   | /api/employees/login     | Employee Login                 |
| GET    | /api/departments         | Get All Departments            |
| POST   | /api/departments         | Create Department              |
| PUT    | /api/departments/:id     | Update Department              |
| DELETE | /api/departments/:id     | Delete Department              |
| GET    | /api/leave-types         | Get All Leave Types            |
| POST   | /api/leave-types         | Create Leave Type              |
| PUT    | /api/leave-types/:id     | Update Leave Type              |
| DELETE | /api/leave-types/:id     | Delete Leave Type              |
| GET    | /api/leaves              | Get Leave Applications         |
| POST   | /api/leaves              | Apply Leave (Employee)         |
| PUT    | /api/leaves/:id          | Approve/Reject Leave (Admin)   |

---

## 🧪 Postman Testing

Set token in header:

```
Authorization: Bearer <jwt_token>
```

Test routes like `/api/leave-types` or `/api/leaves`.

---

## 🛡️ Middleware

- verifyToken middleware validates JWT and sets `req.user`
- Route access is protected via role checks

---

## 🚀 Deployment Notes

- Use Vercel for serverless deployment
- Make sure to:
  - Add MySQL connection using `mysql2/promise`
  - Set `.env` values in Vercel project settings
  - Use `vercel.json` to configure routes if needed

---
