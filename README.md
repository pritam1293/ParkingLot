<div align="center">

# 🚗 QuickPark - Smart Parking Management System

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A modern, full-stack parking management solution with JWT authentication, real-time operations, and administrative analytics**

[Quick Start](#-quick-start) • [Features](#-features) • [Tech Stack](#-tech-stack) • [API Docs](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

<table>
<tr>
<td width="50%">

**User Features**

- 🔐 JWT Authentication & Session Management
- 👤 Profile & Password Management
- 🅿️ Real-time Parking Operations
- 📜 Complete Parking History
- 📱 Mobile-Responsive Design
- 📄 PDF Ticket & Bill Generation

</td>
<td width="50%">

**Admin Features**

- 📊 Revenue Analytics Dashboard
- 🚗 Vehicle Management (Active/Completed)
- 👥 User Management
- 📈 Utilization Statistics
- ⚙️ System Configuration
- 🔍 Advanced Reporting

</td>
</tr>
</table>

## ✨ Features

<details>
<summary><b>🔑 Authentication & User Management</b> (Click to expand)</summary>

- ✅ User Registration & Login with JWT
- ✅ Session Management with automatic token expiration
- ✅ Profile Management (update name, address, contact)
- ✅ Password Change with current password validation
- ✅ OTP-based Contact Update via email
- ✅ Forgot Password with email verification
- ✅ Password Strength Indicator

</details>

<details>
<summary><b>🅿️ Parking Operations</b> (Click to expand)</summary>

- ✅ Automated Spot Allocation (Mini/Compact/Large)
- ✅ Instant Ticket Generation with 10-digit ID
- ✅ Quick Vehicle Unparking with bill calculation
- ✅ Real-time Availability Monitoring
- ✅ Complete Parking History tracking
- ✅ Print Tickets & Bills (PDF export)
- ✅ Dynamic Pricing based on vehicle type & duration

</details>

<details>
<summary><b>📊 Administrative Tools</b> (Click to expand)</summary>

- ✅ Comprehensive Analytics Dashboard
- ✅ Daily/Weekly/Monthly Revenue Reports
- ✅ Active & Completed Session Monitoring
- ✅ User Management & Activity Tracking
- ✅ Parking Utilization Statistics
- ✅ System Configuration Management

</details>

<details>
<summary><b>🎨 UI/UX Excellence</b> (Click to expand)</summary>

- ✅ Mobile-First Responsive Design (TailwindCSS)
- ✅ Protected & Public Route Guards
- ✅ Global Error Boundary
- ✅ Reusable Loading Components
- ✅ Custom 404 Page
- ✅ Real-time Form Validation
- ✅ Session Expired Notifications

</details>

## 🛠 Tech Stack

<table>
<tr>
<td width="50%" valign="top">

**Backend**

- ⚙️ Spring Boot 3.4.2
- ☕ Java 17
- 🍃 MongoDB Atlas
- 🔐 Spring Security + JWT
- 📧 Spring Boot Mail
- 🔧 Maven 3.6+

</td>
<td width="50%" valign="top">

**Frontend**

- ⚛️ React 19.2.0
- 🎨 TailwindCSS 3.4.18
- 🔄 React Router DOM 7.9.5
- 📡 Axios 1.13.1
- 🎭 Lucide React (Icons)
- 📄 html2pdf.js

</td>
</tr>
</table>

<details>
<summary><b>📦 Complete Dependency List</b> (Click to expand)</summary>

**Backend Dependencies:**

- Spring Boot Starter Web, Data MongoDB, Security, Mail
- JWT (io.jsonwebtoken:jjwt-api:0.12.6)
- Dotenv Java (3.0.0)
- Spring Boot Starter Test

**Frontend Dependencies:**

- React 19.2.0 & React DOM
- React Router DOM 7.9.5
- Axios 1.13.1
- TailwindCSS 3.4.18
- Lucide React 0.553.0
- html2pdf.js 0.12.1
- Jest & React Testing Library

</details>

## 🚀 Quick Start

### Prerequisites

- Java 17+, Maven 3.6+, Node.js 16+, MongoDB Atlas account

### Installation

```bash
# 1. Clone repository
git clone https://github.com/pritam1293/ParkingLot.git
cd ParkingLot

# 2. Backend Setup
# Create .env file in root with MongoDB URI, JWT secret, and email config
mvn clean install
mvn spring-boot:run

# 3. Frontend Setup
cd frontend
npm install
npm start
```

<details>
<summary><b>⚙️ Environment Variables Configuration</b> (Click to expand)</summary>

**Backend `.env` (root directory):**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickpark
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION_MS=86400000
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Frontend `.env` (frontend directory):**

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

> **Note**: For Gmail, enable 2FA and create an [App Password](https://myaccount.google.com/apppasswords)

</details>

<details>
<summary><b>🎛️ Configuration Details</b> (Click to expand)</summary>

**Parking Configuration:**

- Mini Spots: 50 | Compact Spots: 75 | Large Spots: 25
- Pricing: Mini (₹20/hr) | Compact (₹35/hr) | Large (₹50/hr)
- First 30 minutes: Free

**Security:**

- JWT Token: 24-hour expiration
- Password: 6-15 chars, uppercase, lowercase, number, special char (@$!%\*?&)
- OTP: 10-minute validity

</details>

<details>
<summary><b>📁 Project Structure</b> (Click to expand)</summary>

```
ParkingLot/
├── frontend/                    # React application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Navbar, Footer, ErrorBoundary, LoadingSpinner, NotFound
│   │   ├── context/             # AuthContext
│   │   ├── pages/               # Home, SignIn, SignUp, Profile, Park, Unpark, Status, History
│   │   │                        # ChangePassword, ChangeContact, ForgotPassword, About
│   │   ├── services/            # axiosConfig, UserAPI, ParkingAPI, validation
│   │   ├── App.js & index.js
│   ├── package.json & tailwind.config.js
│
├── src/main/java/com/quickpark/parkinglot/
│   ├── config/                  # Security, JWT, MongoDB, CORS config
│   ├── controller/              # User, Parking, Admin controllers
│   ├── entities/                # User, Ticket, ParkingSpot, Gate entities
│   ├── repository/              # MongoDB repositories
│   ├── service/                 # Business logic layer
│   └── ParkinglotApplication.java
│
├── pom.xml, mvnw, .env, README.md
```

</details>

## 📡 API Endpoints

<details>
<summary><b>🔐 Authentication Endpoints</b></summary>

| Method | Endpoint                | Description              | Auth |
| ------ | ----------------------- | ------------------------ | ---- |
| POST   | `/auth/register`        | Register new user        | No   |
| POST   | `/auth/login`           | User login (returns JWT) | No   |
| POST   | `/auth/otp/generate`    | Generate OTP for email   | No   |
| POST   | `/auth/otp/verify`      | Verify OTP code          | No   |
| PUT    | `/auth/reset-password`  | Reset password with OTP  | No   |
| PUT    | `/auth/change-password` | Change password          | Yes  |
| PUT    | `/auth/reset-contact`   | Update contact number    | Yes  |

</details>

<details>
<summary><b>🅿️ Parking Operations</b></summary>

| Method | Endpoint                        | Description            | Auth |
| ------ | ------------------------------- | ---------------------- | ---- |
| GET    | `/quickpark/free-parking-spots` | Get available spots    | Yes  |
| POST   | `/quickpark/park`               | Park vehicle           | Yes  |
| DELETE | `/quickpark/unpark`             | Unpark & generate bill | Yes  |
| GET    | `/quickpark/ticket/{id}`        | Get ticket details     | Yes  |
| PUT    | `/quickpark/update-ticket/{id}` | Update vehicle info    | Yes  |

**Example Request (Park):**

```json
POST /quickpark/park
Headers: { "Authorization": "Bearer <jwt_token>" }
{
  "vehicleNo": "KA01AB1234",
  "vehicleType": "COMPACT",
  "ownerName": "John Doe",
  "ownerContact": "9876543210"
}
```

</details>

<details>
<summary><b>👤 User Management</b></summary>

| Method | Endpoint                | Description         | Auth |
| ------ | ----------------------- | ------------------- | ---- |
| GET    | `/user/profile`         | Get user profile    | Yes  |
| PUT    | `/user/update`          | Update profile      | Yes  |
| GET    | `/user/parking-history` | Get parking history | Yes  |

</details>

<details>
<summary><b>👨‍💼 Admin Endpoints</b></summary>

| Method | Endpoint                              | Description               | Auth  |
| ------ | ------------------------------------- | ------------------------- | ----- |
| POST   | `/admin/login`                        | Admin login               | No    |
| GET    | `/quickpark/admin/active-vehicles`    | Currently parked vehicles | Admin |
| GET    | `/quickpark/admin/completed-vehicles` | Completed sessions        | Admin |
| GET    | `/quickpark/admin/all-users`          | All registered users      | Admin |
| GET    | `/quickpark/admin/revenue-today`      | Today's revenue           | Admin |
| GET    | `/quickpark/admin/revenue-week`       | Weekly revenue            | Admin |
| GET    | `/quickpark/admin/revenue-month`      | Monthly revenue           | Admin |
| GET    | `/quickpark/admin/parking-statistics` | Utilization stats         | Admin |

</details>

## 🗄️ Database Schema

<details>
<summary><b>View Collections & Schema</b> (Click to expand)</summary>

**User Collection**

```json
{
  "_id": "ObjectId",
  "firstName": "string",
  "lastName": "string",
  "email": "string (unique)",
  "password": "string (BCrypt hashed)",
  "contact": "string",
  "address": "string",
  "role": "USER/ADMIN",
  "createdAt": "timestamp"
}
```

**ParkedTicket Collection (Active Tickets)**

```json
{
  "_id": "string (10-digit ticket ID)",
  "userId": "string",
  "vehicleNo": "string",
  "vehicleType": "MINI/COMPACT/LARGE",
  "entryTime": "HH:mm",
  "entryDate": "yyyy-MM-dd",
  "parkingSpot": {
    "location": "number",
    "type": "string",
    "cost": "number"
  },
  "completed": false
}
```

**Ticket Collection (Completed Tickets)**

```json
{
  "_id": "string",
  "userId": "string",
  "vehicleNo": "string",
  "entryTime": "HH:mm",
  "exitTime": "HH:mm",
  "entryDate": "yyyy-MM-dd",
  "exitDate": "yyyy-MM-dd",
  "durationMinutes": "number",
  "totalFee": "number",
  "completed": true
}
```

</details>

## 🔒 Security Features

<table>
<tr>
<td width="50%">

**Authentication**

- JWT tokens (24-hr expiry)
- BCrypt password hashing
- OTP verification (10-min validity)
- Role-based access control
- Automatic session management

</td>
<td width="50%">

**Data Protection**

- CORS configuration
- Server & client validation
- XSS protection (React built-in)
- Environment variables for secrets
- MongoDB parameterized queries

</td>
</tr>
</table>

## 📖 Usage Guide

<details>
<summary><b>👤 For Users</b> (Click to expand)</summary>

**1. Register & Login**

- Sign up with email, password, name, contact, address
- Login to receive JWT token (stored automatically)

**2. Park a Vehicle**

- Navigate to Park page
- Select vehicle type (Mini/Compact/Large)
- Enter vehicle number
- Submit → Get 10-digit ticket ID
- Print/save ticket

**3. Unpark & Pay**

- Go to Unpark page
- Enter 10-digit ticket ID
- View calculated bill (duration × rate)
- Print receipt

**4. View History**

- Check complete parking records
- Filter by date
- View total fees paid

**5. Manage Profile**

- Update personal information
- Change password (requires current password)
- Change contact (OTP verification required)
- Reset password via email OTP

</details>

<details>
<summary><b>👨‍💼 For Administrators</b> (Click to expand)</summary>

**1. Login**

- Use admin credentials (default: admin/admin123)
- Access admin dashboard

**2. Monitor System**

- View active parking sessions
- Check completed transactions
- Monitor real-time statistics

**3. Analytics**

- Track daily/weekly/monthly revenue
- View parking utilization trends
- Generate reports

**4. User Management**

- View all registered users
- Check user parking history
- Monitor user activities

</details>

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** changes: `git commit -m 'feat: Add amazing feature'`
4. **Push** to branch: `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

<details>
<summary><b>Development Guidelines</b> (Click to expand)</summary>

**Backend (Java/Spring Boot)**

- Follow Java naming conventions (camelCase, PascalCase)
- Add JavaDoc comments for public methods
- Write unit tests for services
- Handle exceptions gracefully

**Frontend (React)**

- Use functional components with hooks
- Keep components small and focused
- Write reusable, testable components
- Ensure mobile responsiveness

**Commit Messages**

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Adding tests

</details>

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author & Contact

**Pritam Behera**

- GitHub: [@pritam1293](https://github.com/pritam1293)
- Repository: [ParkingLot](https://github.com/pritam1293/ParkingLot)

**Support**

- 📧 Email: support@quickpark.com
- 📱 Phone: +91 86585 35505
- 🐛 Issues: [GitHub Issues](https://github.com/pritam1293/ParkingLot/issues)

## 🚀 Roadmap

Future enhancements planned:

- [ ] Payment Gateway Integration
- [ ] Mobile Apps (Android/iOS)
- [ ] QR Code Tickets
- [ ] Spot Booking System
- [ ] Email/SMS Notifications
- [ ] Multi-location Support
- [ ] Real-time WebSocket Updates
- [ ] Advanced Analytics Dashboard

## 📊 Project Stats

<div align="center">

![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)
![Updated](https://img.shields.io/badge/Updated-November%202025-orange.svg)

**⭐ Star this repo if you find it useful!**

</div>

---

<div align="center">

**Built with ❤️ by [Pritam Behera](https://github.com/pritam1293)**

_Making parking simple, secure, and efficient for everyone_

</div>
