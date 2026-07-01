<div align="center">

# 🌍 Immigration Workflow Management System

### A Full-Stack Role-Based Platform for Managing Overseas Education & Immigration Processes

[![Python](https://img.shields.io/badge/Backend-Python%20%7C%20FastAPI-3776AB?style=flat-square&logo=python&logoColor=white)](#technology-stack)
[![React](https://img.shields.io/badge/Frontend-React.js%20%7C%20Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](#technology-stack)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](#authentication--authorization)
[![Database](https://img.shields.io/badge/Database-SQLite%20%7C%20MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](#database)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

</div>

---

## 📖 Project Overview

In a traditional immigration consultancy, student information is handled by multiple departments separately — making tracking and communication difficult.

**This system solves that problem** by providing a centralized workflow that connects every department involved in a student's journey, from first registration to final visa decision.

### Core Capabilities

| | |
|---|---|
| 🗂️ Centralized student management | 📧 Email notifications |
| 🔄 Stage-wise workflow tracking | 📜 Audit logging |
| 🔐 Role-based access control | 📊 Student progress monitoring |
| 📁 Document management | 💳 Payment tracking |

### The Student Journey

A student moves sequentially through the following stages, each managed by a dedicated officer:

```
Reception → Enquiry → Counselling → Admission → Enrollment → Visa
```

---

## 👥 User Roles

The system supports **8 distinct roles**, each with its own dashboard and permission set.

| Role | Responsibilities |
|------|------------------|
| 🛡️ **Super Admin** | Complete system management, staff management, monitoring and control |
| 🖥️ **Receptionist** | Student registration, account creation, initial document collection |
| 📋 **Enquiry Officer** | Collect student profile and educational information |
| 🎓 **Counsellor** | Country guidance, course selection, university shortlisting |
| 🏛️ **Admission Officer** | University applications, offer letter tracking |
| ✅ **Enrollment Officer** | University enrollment and tuition verification |
| 🛂 **Visa Officer** | Visa application, financial verification and final decision |
| 🧑‍🎓 **Student** | View progress, documents, payments and workflow status |

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Secure login system
- Role-based access control
- Protected routes
- Password hashing
- User permission management

---

## 🔄 Student Workflow Management

The complete student journey flows through six managed stages.

<details>
<summary><strong>1️⃣ Reception Stage</strong></summary>

- Create student profile
- Generate student login credentials
- Upload initial documents
- Collect registration information
- Assign enquiry officer
- Send welcome email
</details>

<details>
<summary><strong>2️⃣ Enquiry Stage</strong></summary>

- Collect academic details
- Update student profile
- Upload educational documents
- Assign counsellor
</details>

<details>
<summary><strong>3️⃣ Counselling Stage</strong></summary>

- Country recommendations
- Course guidance
- University shortlisting
- Counselling notes
- Admission officer assignment
</details>

<details>
<summary><strong>4️⃣ Admission Stage</strong></summary>

- University applications
- Application tracking
- Offer letter upload
- Admission progress management
</details>

<details>
<summary><strong>5️⃣ Enrollment Stage</strong></summary>

- University enrollment completion
- Tuition fee verification
- Enrollment document management
</details>

<details>
<summary><strong>6️⃣ Visa Stage</strong></summary>

- Visa application management
- Financial document verification
- Visa tracking
- Final visa decision
</details>

---

## 📁 Document Management

The system supports stage-wise document handling for documents including:

`Passport` · `Photograph` · `10th Marksheet` · `12th Marksheet` · `Graduation Documents` · `Resume` · `SOP` · `LOR` · `Offer Letter` · `Enrollment Letter` · `Tuition Receipt` · `Bank Statements` · `Visa Documents`

---

## 📧 Email Notification System

Automated email notifications are powered by the **Brevo (Sendinblue) Email API**, triggered at key workflow events.

**Student Registration Email**
> When a receptionist creates a student account, the student automatically receives login credentials and a welcome email.

**Workflow Notifications** are sent for:
- Officer assignment
- Stage completion
- Application updates
- Visa updates
- Important student communication

> 🔒 Email configuration is managed securely via environment variables — sensitive keys are never stored in the codebase.

---

## 🛡️ Super Admin Panel

The Super Admin has complete visibility and control over the platform:

- Create and manage staff accounts
- View all students and their workflow progress
- Manage franchises and institutes
- Assign officers
- Monitor tasks
- Manage notifications
- View system activity logs

---

## 🎓 Student Portal

Students can:

- Log in using provided credentials
- View application progress
- View assigned officers
- View uploaded documents
- View payment history
- Track their current workflow stage

> ℹ️ Students have **read-only** access — they cannot modify workflow data directly.

---

## ✅ Task Management System

- Create tasks
- Assign tasks
- Track completion
- Monitor workflow activities

---

## 🛠️ Technology Stack

<table>
<tr>
<td valign="top" width="33%">

**Backend**
- Python
- FastAPI
- SQLAlchemy ORM
- Pydantic
- JWT Authentication
- REST APIs

</td>
<td valign="top" width="33%">

**Frontend**
- React.js
- Vite
- React Router
- Axios

</td>
<td valign="top" width="33%">

**Database & Services**
- SQLite (Development)
- MySQL-compatible architecture
- Brevo Email API

</td>
</tr>
</table>

---

## 🗄️ Database Models

Main entities in the system:

`users` · `students` · `assignments` · `documents` · `payments` · `audit_logs` · `refunds` · `notifications` · `tasks` · `institutes` · `franchises`

---

## 🔒 Security Features

- JWT authentication
- Role-based authorization
- Password hashing
- Environment-based secrets
- Protected APIs
- Restricted user permissions

---

## 🚀 Future Enhancements

- [ ] MySQL production deployment
- [ ] Cloud document storage
- [ ] Payment gateway integration
- [ ] AI-based student counselling assistant
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Real-time notifications
- [ ] Automated university recommendation system

---

## 📸 Screenshots

### Login Page
<img width="900" alt="login_page" src="https://github.com/user-attachments/assets/146b9d44-b095-4ce9-9d3d-05f24a59f84c" />

### Super Admin Dashboard
<img width="900" alt="admin_page" src="https://github.com/user-attachments/assets/af881549-0762-491f-b1ef-d0d2aaf7b6eb" />

### Features

<table>
<tr>
<td><img width="440" alt="f1" src="https://github.com/user-attachments/assets/d9f059b9-6956-4bb2-8139-bba47e639237" /></td>
<td><img width="440" alt="f2" src="https://github.com/user-attachments/assets/8faa2050-296b-4c97-a94b-a9d767a1234b" /></td>
</tr>
<tr>
<td><img width="440" alt="f3" src="https://github.com/user-attachments/assets/7264ebb5-a2c1-4836-b149-7664567beb2c" /></td>
<td><img width="440" alt="f4" src="https://github.com/user-attachments/assets/72971579-1e43-46c4-b954-69c26573c727" /></td>
</tr>
<tr>
<td><img width="440" alt="f5" src="https://github.com/user-attachments/assets/e6d65e06-edbc-4d98-b795-434c0e1d0760" /></td>
<td><img width="440" alt="f6" src="https://github.com/user-attachments/assets/82206d68-3b03-4a74-8d0b-3fe88dfbdc37" /></td>
</tr>
<tr>
<td colspan="2" align="center"><img width="440" alt="f7" src="https://github.com/user-attachments/assets/4df3ac1e-ba31-4721-a635-63ea3a45c468" /></td>
</tr>
</table>

### Student Dashboard
<img width="900" alt="student_page" src="https://github.com/user-attachments/assets/1b27743d-e95f-4340-9cfe-5cb36bce836c" />

---

<div align="center">

**Built to bring order to a fragmented process.**

</div>
