
---

```markdown
# Employee Leave Management System – Backend

🔗 **Live Demo:** [Employee Leave Management System](https://employee-leave-management-frontend.vercel.app/login)

This is the **backend** of the Employee Leave Management System built using **Node.js**, **Express**, and **MySQL**. It provides APIs for managing departments, employees, leave types, leave applications, and admin actions.

---

## 🚀 Getting Started

### 📦 Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or above)
- **MySQL** server
- **npm** (comes with Node.js)

---

## 📁 Folder Structure

```

backend/
├── controllers/
│   ├── authController.js
│   ├── departmentController.js
│   ├── employeeController.js
│   ├── leaveController.js
│   ├── leaveTypeController.js
│   └── employeeLeaveController.js
│
├── middlewares/
│   └── verifyToken.js
│
├── routes/
│   ├── authRoutes.js
│   ├── departmentRoutes.js
│   ├── employeeRoutes.js
│   ├── leaveRoutes.js
│   ├── leaveTypeRoutes.js
│   └── employeeLeaveRoutes.js
│
├── db.js
├── index.js
├── .env
├── .gitignore
└── package.json

````

---

## 🛠️ Installation & Running the Server

1. Clone the repository:

```bash
git clone https://github.com/your-username/employee-leave-management-backend.git
cd employee-leave-management-backend
````

2. Install dependencies:

```bash
npm install
```

3. Start the server (development):

```bash
npm run dev
```

4. Or build and run production:

```bash
npm start
```

> The server runs at `http://localhost:5000` by default.

---

## 🧠 Features

* 👨‍💼 Admin login with JWT token authentication
* 🏢 Department management (CRUD)
* 📄 Leave type management (CRUD)
* 👥 Employee registration, login, profile view
* 📅 Leave application by employees
* ✅ Admin approval/rejection of leave applications
* 🔒 Protected API routes with role-based access
* 📊 Leave history tracking per employee

---

## 🔗 API Endpoints

Here are a few key endpoints:

| Endpoint               | Method | Description                     |
| ---------------------- | ------ | ------------------------------- |
| `/api/auth/login`      | POST   | Admin login                     |
| `/api/departments`     | CRUD   | Department management           |
| `/api/leave-types`     | CRUD   | Leave type management           |
| `/api/employees`       | CRUD   | Employee management             |
| `/api/leaves`          | CRUD   | Leave application & actions     |
| `/api/employee-leaves` | CRUD   | Employee-specific leave history |

---

## 🧪 Testing the API

Use **Postman** or **Thunder Client** to test your endpoints. Pass the JWT token in headers like:

```http
Authorization: Bearer <your_token>
```

---

## 📘 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## 👨‍💻 Author

Developed by \[Vinaykrishna]

```