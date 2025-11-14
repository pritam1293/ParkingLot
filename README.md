# 🚗 QuickPark - Smart Parking Management System

A comprehensive parking lot management system built with Spring Boot backend and React frontend, featuring JWT authentication, user management, real-time parking operations, and administrative analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

QuickPark is a modern, full-stack parking management solution that provides:

- **User Authentication & Authorization**: Secure JWT-based authentication with session management
- **Real-time Parking Operations**: Live availability tracking and instant ticket generation
- **Multi-tier Vehicle Classification**: Support for Mini, Compact, and Large vehicles
- **Dynamic Pricing System**: Automatic fee calculation based on vehicle type and duration
- **User Profile Management**: Update profile, change password, and contact information with OTP verification
- **Administrative Dashboard**: Comprehensive analytics and system management
- **Responsive Design**: Mobile-first approach with TailwindCSS styling

## ✨ Features

### User Management & Authentication

- ✅ **User Registration & Login**: Secure signup/signin with JWT token authentication
- ✅ **Session Management**: Automatic token expiration handling with seamless logout
- ✅ **Profile Management**: Update personal information (name, address, contact)
- ✅ **Password Management**: Change password with current password validation
- ✅ **Contact Update**: OTP-based contact number change with email verification
- ✅ **Forgot Password**: Email-based password reset with OTP verification

### Parking Operations

- ✅ **Vehicle Parking**: Automated spot allocation with instant ticket generation
- ✅ **Vehicle Unparking**: Quick retrieval with automatic fee calculation and bill generation
- ✅ **Real-time Status**: Live availability monitoring across all parking zones
- ✅ **Parking History**: View complete parking history with dates, times, and fees
- ✅ **Multi-vehicle Support**: Categorized parking for Mini, Compact, and Large vehicles
- ✅ **Print Functionality**: Generate printable tickets and bills (PDF export)

### Administrative Features

- ✅ **Admin Dashboard**: Comprehensive analytics and management interface
- ✅ **Revenue Analytics**: Track daily, weekly, and monthly revenue
- ✅ **Vehicle Management**: Monitor active and completed parking sessions
- ✅ **User Management**: View and manage registered users
- ✅ **Utilization Statistics**: Parking usage distribution and trends
- ✅ **System Configuration**: Manage parking rates and spot availability

### UI/UX Features

- ✅ **Responsive Design**: Mobile-first design with TailwindCSS
- ✅ **Protected Routes**: Route guards for authenticated and public pages
- ✅ **Error Handling**: Global error boundary with graceful fallback UI
- ✅ **Loading States**: Reusable loading spinner component
- ✅ **404 Page**: Custom not found page with navigation
- ✅ **Form Validation**: Client-side validation with real-time feedback
- ✅ **Password Strength Indicator**: Visual password requirements checker
- ✅ **Session Expired Notifications**: Auto-redirect with user-friendly messages

## 🛠 Technology Stack

### Backend

- **Framework**: Spring Boot 3.4.2
- **Language**: Java 17
- **Database**: MongoDB Atlas
- **Build Tool**: Maven 3.6+
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Email Service**: Spring Boot Mail (for OTP verification)
- **Key Dependencies**:
  - Spring Boot Starter Web
  - Spring Boot Starter Data MongoDB
  - Spring Boot Starter Security
  - Spring Boot Starter Mail
  - JWT (io.jsonwebtoken:jjwt-api:0.12.6)
  - Dotenv Java (3.0.0)

### Frontend

- **Framework**: React 19.2.0
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Routing**: React Router DOM 7.9.5
- **HTTP Client**: Axios 1.13.1
- **Styling**: TailwindCSS 3.4.18
- **Icons**: Lucide React 0.553.0
- **PDF Generation**: html2pdf.js 0.12.1
- **Testing**: Jest, React Testing Library

### Development Tools

- **Version Control**: Git
- **IDE**: VS Code / IntelliJ IDEA
- **API Testing**: Postman / Thunder Client
- **Package Manager**: npm (frontend), Maven (backend)

## 📁 Project Structure

```
ParkingLot/
├── 📁 frontend/                              # React frontend application
│   ├── � public/                            # Static assets
│   │   ├── �📄 index.html                     # HTML template
│   │   ├── 📄 manifest.json                  # PWA manifest
│   │   ├── 📄 robots.txt                     # Search engine crawler rules
│   │   └── 📁 images/                        # Static images
│   ├── 📁 src/                               # Source code
│   │   ├── 📁 components/                    # Reusable components
│   │   │   ├── 📄 navbar.js                  # Navigation bar with mobile menu
│   │   │   ├── 📄 footer.js                  # Footer component
│   │   │   ├── 📄 ProtectedRoute.js          # Auth-required route guard
│   │   │   ├── 📄 PublicRoute.js             # Public-only route guard
│   │   │   ├── 📄 LoadingSpinner.js          # Reusable loading component
│   │   │   ├── 📄 ErrorBoundary.js           # React error boundary
│   │   │   └── 📄 NotFound.js                # 404 error page
│   │   ├── 📁 context/                       # React context providers
│   │   │   └── 📄 AuthContext.js             # Authentication state management
│   │   ├── 📁 pages/                         # Page components
│   │   │   ├── 📄 home.js                    # Landing page
│   │   │   ├── 📄 signin.js                  # User login
│   │   │   ├── 📄 signup.js                  # User registration
│   │   │   ├── 📄 profile.js                 # User profile management
│   │   │   ├── 📄 park.js                    # Vehicle parking interface
│   │   │   ├── 📄 unpark.js                  # Vehicle unparking & billing
│   │   │   ├── 📄 status.js                  # Real-time parking status
│   │   │   ├── 📄 history.js                 # Parking history
│   │   │   ├── 📄 about.js                   # About page
│   │   │   ├── 📄 changePassword.js          # Password change with validation
│   │   │   ├── 📄 changeContact.js           # OTP-based contact update
│   │   │   └── 📄 forgotPassword.js          # Password reset flow
│   │   ├── 📁 services/                      # API service layer
│   │   │   ├── 📄 axiosConfig.js             # Shared axios configuration
│   │   │   ├── 📄 UserAPI.js                 # User-related API calls
│   │   │   ├── 📄 ParkingAPI.js              # Parking-related API calls
│   │   │   ├── 📄 validation.js              # Form validation utilities
│   │   │   └── 📄 vehicleCategories.js       # Vehicle type definitions
│   │   ├── 📄 App.js                         # Main app component with routing
│   │   ├── 📄 index.js                       # React entry point
│   │   └── 📄 index.css                      # Global styles with Tailwind
│   ├── 📄 package.json                       # npm dependencies
│   ├── 📄 tailwind.config.js                 # TailwindCSS configuration
│   └── 📄 .env                               # Frontend environment variables
│
├── 📁 src/main/java/com/quickpark/parkinglot/  # Backend source code
│   ├── 📁 config/                            # Configuration classes
│   │   ├── 📄 DotEnvConfig.java              # Environment variable loader
│   │   ├── 📄 JWT.java                       # JWT utility methods
│   │   ├── 📄 JwtAuthenticationEntryPoint.java # JWT error handler
│   │   ├── 📄 JwtAuthenticationFilter.java   # JWT request filter
│   │   ├── 📄 MongoConfig.java               # MongoDB configuration
│   │   ├── 📄 SecurityConfig.java            # Spring Security config
│   │   └── 📄 WebConfig.java                 # CORS and web configuration
│   ├── 📁 controller/                        # REST API controllers
│   │   ├── 📄 AdminController.java           # Admin operations
│   │   ├── 📄 ParkingController.java         # Parking operations
│   │   └── 📄 UserController.java            # User authentication & management
│   ├── 📁 custom/                            # Custom utility classes
│   │   ├── 📄 Pair.java                      # Generic pair class
│   │   └── 📄 Tuple.java                     # Generic tuple class
│   ├── 📁 entities/                          # MongoDB entities
│   │   ├── 📄 CompactParkingSpot.java        # Compact vehicle spots
│   │   ├── 📄 DisplayBoard.java              # Display board entity
│   │   ├── 📄 Gate.java                      # Gate entity
│   │   ├── 📄 LargeParkingSpot.java          # Large vehicle spots
│   │   ├── 📄 MiniParkingSpot.java           # Mini vehicle spots
│   │   ├── 📄 ParkedTicket.java              # Active parking ticket
│   │   ├── 📄 ParkingSpot.java               # Base parking spot
│   │   ├── 📄 Ticket.java                    # Completed parking ticket
│   │   └── 📄 User.java                      # User entity
│   ├── 📁 Exceptions/                        # Custom exception classes
│   │   └── [Custom exception handlers]
│   ├── 📁 repository/                        # MongoDB repositories
│   │   ├── 📄 UserRepository.java            # User data operations
│   │   ├── 📄 TicketRepository.java          # Ticket data operations
│   │   └── 📄 ParkedTicketRepository.java    # Active ticket operations
│   ├── 📁 response/                          # Response DTOs
│   │   └── [Response models]
│   ├── 📁 service/                           # Business logic layer
│   │   ├── 📄 ParkingService.java            # Parking operations service
│   │   ├── 📄 UserService.java               # User management service
│   │   └── 📄 EmailService.java              # Email/OTP service
│   └── 📄 ParkinglotApplication.java         # Spring Boot main class
│
├── 📁 src/main/resources/
│   ├── 📄 application.properties             # Application configuration
│   └── 📁 META-INF/
│       └── 📄 spring.factories               # Spring Boot auto-configuration
│
├── 📁 target/                                # Maven build output
├── 📄 pom.xml                                # Maven dependencies
├── 📄 mvnw                                   # Maven wrapper (Unix)
├── 📄 mvnw.cmd                               # Maven wrapper (Windows)
├── 📄 .env                                   # Backend environment variables
└── 📄 README.md                              # Project documentation
```

## 📋 Prerequisites

Before running this application, ensure you have:

- **Java 17** or higher installed
- **Maven 3.6+** for backend dependency management
- **Node.js 16+** and **npm** for frontend
- **MongoDB Atlas** account or local MongoDB server
- **Email Service** (Gmail SMTP or similar) for OTP functionality
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/pritam1293/ParkingLot.git
cd ParkingLot
```

### 2. Backend Setup

#### Database Configuration

Create a MongoDB Atlas cluster or ensure local MongoDB is running:

- **MongoDB Atlas**: Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- **Local MongoDB**: Start MongoDB service on your system

#### Environment Variables

Create a `.env` file in the **root directory** (not in frontend):

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickpark?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRATION_MS=86400000

# Email Configuration (for OTP)
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-specific-password
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

> **Note**: For Gmail, enable 2-factor authentication and create an [App Password](https://myaccount.google.com/apppasswords)

#### Build and Run Backend

```bash
# Install dependencies and build
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

#### Navigate to Frontend Directory

```bash
cd frontend
```

#### Environment Variables

Create a `.env` file in the **frontend directory**:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

#### Install Dependencies and Run

```bash
# Install npm packages
npm install

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

### 4. Verify Installation

1. **Backend Health Check**: Visit `http://localhost:8080/quickpark/home`
2. **Frontend**: Visit `http://localhost:3000`
3. **Test Registration**: Create a new user account
4. **Test Parking**: Park a vehicle and verify ticket generation

## ⚙️ Configuration

### Application Properties

Edit `src/main/resources/application.properties`:

```properties
# Application name
spring.application.name=parkinglot

# MongoDB connection (loaded from .env)
spring.data.mongodb.uri=${MONGODB_URI}

# JWT configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION_MS}

# Email configuration (loaded from .env)
spring.mail.host=${SPRING_MAIL_HOST}
spring.mail.port=${SPRING_MAIL_PORT}
spring.mail.username=${SPRING_MAIL_USERNAME}
spring.mail.password=${SPRING_MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=${SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH}
spring.mail.properties.mail.smtp.starttls.enable=${SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE}

# JSON serialization settings
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone=UTC
```

### Parking Lot Configuration

Default parking spot allocation (configurable in code):

- **Mini Spots**: 50 (motorcycles, scooters, compact cars)
- **Compact Spots**: 75 (standard cars, sedans)
- **Large Spots**: 25 (SUVs, trucks, vans)
- **Total Capacity**: 150 vehicles

### Pricing Structure

Hourly rates (configurable in backend):

- **Mini vehicles**: ₹20/hour
- **Compact vehicles**: ₹35/hour
- **Large vehicles**: ₹50/hour
- **First 30 minutes**: Free (grace period)

### Security Configuration

- **JWT Token Expiration**: 24 hours (86400000 ms)
- **Password Requirements**: 6-15 characters, uppercase, lowercase, number, special character (@$!%\*?&)
- **OTP Validity**: 10 minutes
- **Session Management**: Automatic logout on token expiration

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint                | Description                        | Auth Required |
| ------ | ----------------------- | ---------------------------------- | ------------- |
| POST   | `/auth/register`        | Register new user                  | No            |
| POST   | `/auth/login`           | User login (returns JWT token)     | No            |
| POST   | `/auth/otp/generate`    | Generate OTP for password reset    | No            |
| POST   | `/auth/otp/verify`      | Verify OTP code                    | No            |
| PUT    | `/auth/reset-password`  | Reset password with OTP            | No            |
| PUT    | `/auth/change-password` | Change password (requires current) | Yes           |
| PUT    | `/auth/reset-contact`   | Update contact number              | Yes           |

### User Management Endpoints

| Method | Endpoint                | Description                | Auth Required |
| ------ | ----------------------- | -------------------------- | ------------- |
| GET    | `/user/profile`         | Get user profile           | Yes           |
| PUT    | `/user/update`          | Update user profile        | Yes           |
| GET    | `/user/parking-history` | Get user's parking history | Yes           |

### Parking Operations Endpoints

| Method | Endpoint                        | Description                      | Auth Required |
| ------ | ------------------------------- | -------------------------------- | ------------- |
| GET    | `/quickpark/home`               | Welcome message                  | No            |
| GET    | `/quickpark/free-parking-spots` | Get available spots by type      | Yes           |
| POST   | `/quickpark/park`               | Park a vehicle                   | Yes           |
| DELETE | `/quickpark/unpark`             | Unpark vehicle and generate bill | Yes           |
| PUT    | `/quickpark/update-ticket/{id}` | Update vehicle details           | Yes           |
| GET    | `/quickpark/ticket/{id}`        | Get ticket details               | Yes           |

### Admin Endpoints

| Method | Endpoint                              | Description                      | Auth Required |
| ------ | ------------------------------------- | -------------------------------- | ------------- |
| POST   | `/admin/login`                        | Admin authentication             | No            |
| GET    | `/quickpark/admin/active-vehicles`    | Get currently parked vehicles    | Yes (Admin)   |
| GET    | `/quickpark/admin/completed-vehicles` | Get completed parking sessions   | Yes (Admin)   |
| GET    | `/quickpark/admin/all-vehicles`       | Get all parking history          | Yes (Admin)   |
| GET    | `/quickpark/admin/all-users`          | Get all registered users         | Yes (Admin)   |
| GET    | `/quickpark/admin/unparked-today`     | Count of vehicles unparked today | Yes (Admin)   |
| GET    | `/quickpark/admin/revenue-today`      | Today's total revenue            | Yes (Admin)   |
| GET    | `/quickpark/admin/revenue-week`       | Weekly revenue                   | Yes (Admin)   |
| GET    | `/quickpark/admin/revenue-month`      | Monthly revenue                  | Yes (Admin)   |
| GET    | `/quickpark/admin/parking-statistics` | Parking utilization statistics   | Yes (Admin)   |

### Request/Response Examples

#### Register User

```json
POST /auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "contact": "9876543210",
  "address": "123 Main St, City"
}
```

#### Park Vehicle

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

#### Response

```json
{
  "ticketId": "1234567890",
  "vehicleNo": "KA01AB1234",
  "spotLocation": "C-42",
  "entryTime": "14:30",
  "entryDate": "2025-11-14",
  "costPerHour": 35.0
}
```

## 🌐 Frontend Pages

### Public Pages (Accessible to all)

- **🏠 Home (`/`)**:

  - Landing page with feature overview
  - Quick access to parking operations
  - System status and availability

- **🔐 Sign In (`/signin`)**:

  - User authentication with email/password
  - JWT token generation
  - Session expired notifications
  - Redirect to forgot password

- **📝 Sign Up (`/signup`)**:

  - New user registration
  - Form validation with real-time feedback
  - Password strength indicator
  - Automatic login after registration

- **🔑 Forgot Password (`/forgot-password`)**:

  - Three-step password reset flow
  - Email-based OTP verification
  - New password with strength validation
  - Accessible from anywhere (no auto-logout)

- **ℹ️ About (`/about`)**:
  - Information about QuickPark
  - Contact details and features

### Protected Pages (Login required)

- **👤 Profile (`/profile`)**:

  - View and edit user information
  - Update name, address, contact
  - Links to password/contact change
  - Session management

- **🅿️ Park (`/park`)**:

  - Vehicle parking form
  - Vehicle type selection (Mini/Compact/Large)
  - Real-time spot availability
  - Instant ticket generation
  - Print ticket functionality

- **🚗 Unpark (`/unpark`)**:

  - Ticket ID search
  - Bill calculation and display
  - Parking duration tracking
  - Print bill (PDF export)

- **📊 Status (`/status`)**:

  - Real-time parking availability
  - Spot distribution by type
  - Visual occupancy indicators
  - Current parking statistics

- **📜 History (`/history`)**:

  - Complete parking history
  - Sortable and searchable records
  - Date-wise filtering
  - Total fees calculation

- **� Change Password (`/change-password`)**:

  - Current password verification
  - New password with validation
  - Password strength indicator (5 requirements)
  - Link to forgot password flow

- **� Change Contact (`/change-contact`)**:
  - Three-step OTP verification
  - Email-based verification
  - 60-second resend countdown
  - 10-digit contact validation

### Special Pages

- **❌ 404 Not Found (`*`)**:
  - Custom error page
  - Animated 404 illustration
  - Quick navigation links
  - "Go Back" and "Go Home" buttons

### Navigation

- **Navbar**:

  - Responsive design with mobile menu
  - Fixed positioning on mobile
  - Authentication-based menu items
  - Profile dropdown with quick access

- **Footer**:
  - Contact information
  - Social media links
  - Copyright notice

## 🗄️ Database Schema

### User Collection

```json
{
  "_id": "ObjectId",
  "firstName": "string",
  "lastName": "string",
  "email": "string (unique, indexed)",
  "password": "string (hashed)",
  "contact": "string",
  "address": "string",
  "role": "string (USER/ADMIN)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### ParkedTicket Collection (Active Tickets)

```json
{
  "_id": "string (10-digit ticket ID)",
  "userId": "string (reference to User)",
  "ownerName": "string",
  "ownerContact": "string",
  "vehicleNo": "string",
  "vehicleType": "string (MINI/COMPACT/LARGE)",
  "entryTime": "string (HH:mm)",
  "entryDate": "string (yyyy-MM-dd)",
  "parkingSpot": {
    "location": "number",
    "type": "string",
    "cost": "number (per hour)",
    "booked": "boolean"
  },
  "completed": false
}
```

### Ticket Collection (Completed Tickets)

```json
{
  "_id": "string (same as ParkedTicket ID)",
  "userId": "string",
  "ownerName": "string",
  "ownerContact": "string",
  "vehicleNo": "string",
  "vehicleType": "string",
  "entryTime": "string (HH:mm)",
  "exitTime": "string (HH:mm)",
  "entryDate": "string (yyyy-MM-dd)",
  "exitDate": "string (yyyy-MM-dd)",
  "durationMinutes": "number",
  "totalFee": "number",
  "parkingSpot": {
    "location": "number",
    "type": "string",
    "cost": "number",
    "booked": false
  },
  "completed": true
}
```

### Gate Collection

```json
{
  "_id": "ObjectId",
  "gateId": "string (unique)",
  "gateName": "string",
  "gateType": "string (ENTRY/EXIT/BOTH)",
  "guardName": "string",
  "isActive": "boolean"
}
```

### OTP Collection (Temporary)

```json
{
  "_id": "ObjectId",
  "email": "string",
  "otp": "string (6-digit)",
  "createdAt": "timestamp",
  "expiresAt": "timestamp (10 minutes from creation)",
  "verified": "boolean"
}
```

### Indexes

- `User.email`: Unique index for fast authentication lookup
- `ParkedTicket._id`: Primary key (ticket ID)
- `Ticket.userId`: Index for user history queries
- `Ticket.exitDate`: Index for date-based revenue queries

## 🔐 Security Features

### Authentication & Authorization

- **JWT-based Authentication**: Stateless token-based authentication
- **Token Expiration**: Automatic logout after 24 hours
- **Password Hashing**: BCrypt encryption for user passwords
- **Protected Routes**: Frontend route guards for authenticated pages
- **Role-based Access**: Separate admin and user roles

### Data Security

- **CORS Configuration**: Controlled cross-origin resource sharing
- **Input Validation**: Server-side and client-side validation
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: React's built-in XSS protection
- **Environment Variables**: Sensitive data stored in .env files

### Session Management

- **Automatic Token Refresh**: Seamless session management
- **Session Expired Notifications**: User-friendly expiration alerts
- **Logout on All Devices**: Token invalidation on password change
- **Remember Me**: Persistent authentication (localStorage)

### OTP Verification

- **Email-based OTP**: Secure 6-digit codes
- **Time-limited Validity**: 10-minute expiration
- **Rate Limiting**: 60-second cooldown between requests
- **One-time Use**: OTP invalidated after verification

### Password Security

- **Strong Password Policy**:
  - 6-15 characters length
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%\*?&)
- **Password Strength Indicator**: Real-time validation feedback
- **Current Password Verification**: Required for password changes

## 📖 Usage

### For New Users

1. **Create Account**:

   - Click "Sign Up" on the homepage
   - Fill in personal details (name, email, contact, address)
   - Create a strong password (see requirements)
   - Verify email if required
   - Auto-login after successful registration

2. **Sign In**:
   - Enter registered email and password
   - Receive JWT token (stored automatically)
   - Redirected to homepage with authenticated access

### For Registered Users

1. **Parking a Vehicle**:

   - Navigate to "Park" page from navbar
   - Select vehicle type (Mini/Compact/Large)
   - Enter vehicle details:
     - Vehicle number (e.g., KA01AB1234)
     - Owner name (auto-filled from profile)
     - Contact number (auto-filled)
   - Check real-time spot availability
   - Submit to generate parking ticket
   - Print or save ticket (10-digit ticket ID)

2. **Unparking a Vehicle**:

   - Go to "Unpark" page
   - Enter 10-digit ticket ID
   - System calculates:
     - Total parking duration
     - Applicable charges
     - Grace period (first 30 minutes free)
   - Review bill details
   - Print bill for payment
   - Complete unparking process

3. **Check Parking Status**:

   - Visit "Status" page for real-time availability
   - View parking distribution across categories
   - Monitor occupancy rates by vehicle type
   - Check current parking statistics

4. **View History**:

   - Navigate to "History" page
   - See complete parking records
   - Filter by date range
   - View total fees paid
   - Download parking receipts

5. **Manage Profile**:

   - Click profile icon in navbar
   - Update personal information (name, address)
   - Change password (requires current password)
   - Change contact number (OTP verification)
   - View account details

6. **Password Recovery**:
   - Click "Forgot Password" on signin page
   - Enter registered email
   - Receive OTP via email
   - Verify OTP code
   - Set new password
   - Login with new credentials

### For Administrators

1. **Admin Login**:

   - Use admin credentials:
     - Username: `admin`
     - Password: `admin123` (change in production!)
   - Access admin dashboard

2. **Monitor System**:

   - View active parking sessions
   - Check completed transactions
   - Monitor system health

3. **Analytics & Reports**:

   - Daily revenue tracking
   - Weekly/monthly revenue trends
   - Vehicle count statistics
   - Parking utilization reports
   - User registration trends

4. **User Management**:

   - View all registered users
   - Check user parking history
   - Monitor user activities

5. **System Configuration**:
   - Manage parking rates
   - Configure spot availability
   - Update system settings

## 🤝 Contributing

We welcome contributions! Here's how you can help improve QuickPark:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/ParkingLot.git
   cd ParkingLot
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/AmazingFeature
   ```

### Development Workflow

1. **Make your changes**:

   - Follow the existing code style
   - Write clean, documented code
   - Add comments for complex logic

2. **Test your changes**:

   - Backend: Run `mvn test`
   - Frontend: Run `npm test`
   - Manual testing in browser

3. **Commit your changes**:

   ```bash
   git add .
   git commit -m 'Add: Brief description of feature'
   ```

4. **Push to your fork**:

   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request** on GitHub

### Development Guidelines

#### Backend (Java/Spring Boot)

- Follow Java naming conventions (camelCase for variables, PascalCase for classes)
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Write unit tests for service layer
- Handle exceptions gracefully
- Use DTOs for request/response objects

#### Frontend (React)

- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use PropTypes or TypeScript for type checking
- Write reusable components
- Use semantic HTML
- Ensure mobile responsiveness

#### General

- Write clear commit messages using conventional commits:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `refactor:` for code refactoring
  - `test:` for adding tests
- Update documentation for API changes
- Don't commit `.env` files or sensitive data
- Keep pull requests focused on a single feature/fix

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Report bugs and security issues responsibly

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage
- 🌐 Internationalization (i18n)
- ♿ Accessibility improvements

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Pritam Behera**

- GitHub: [@pritam1293](https://github.com/pritam1293)
- Repository: [ParkingLot](https://github.com/pritam1293/ParkingLot)

## 🙏 Acknowledgments

- **Spring Boot** community for excellent documentation and ecosystem
- **React** team for the amazing frontend framework
- **MongoDB** for reliable and scalable database solution
- **TailwindCSS** for utility-first CSS framework
- **JWT.io** for authentication best practices
- All contributors and testers who helped improve the system

## 📞 Support & Contact

For questions, support, or feedback:

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/pritam1293/ParkingLot/issues)
- **Email**: support@quickpark.com
- **Phone**: +91 86585 35505

## 🚀 Future Enhancements

Planned features for upcoming versions:

- [ ] **Payment Gateway Integration**: Online payment support
- [ ] **Mobile App**: Native Android/iOS applications
- [ ] **QR Code Tickets**: Scan-to-park and scan-to-exit
- [ ] **Booking System**: Pre-book parking spots
- [ ] **Analytics Dashboard**: Advanced reporting and insights
- [ ] **Multi-location Support**: Manage multiple parking lots
- [ ] **Notifications**: Email/SMS alerts for parking events
- [ ] **Loyalty Program**: Rewards for frequent users
- [ ] **API Rate Limiting**: Enhanced security and performance
- [ ] **Microservices Architecture**: Scale individual components
- [ ] **Real-time WebSocket**: Live updates without refresh
- [ ] **AI-based Predictions**: Predict parking availability

## � Project Status

- **Version**: 1.0.0
- **Status**: Active Development
- **Last Updated**: November 2025
- **Stability**: Production Ready

## 🏆 Features Highlights

✨ **Production-Ready Code**

- No duplicate code (shared axios configuration)
- No unused code or files
- Consistent validation across all pages
- Clean error handling (no console exposure)
- Global error boundary for React errors
- Custom 404 page with navigation
- Reusable loading spinner component

🔒 **Security First**

- JWT authentication with automatic expiration
- BCrypt password hashing
- OTP-based verification for sensitive operations
- CORS configuration for API security
- Environment variables for sensitive data

📱 **Mobile-First Design**

- Responsive design with TailwindCSS
- Mobile-optimized navigation
- Touch-friendly UI elements
- Cross-browser compatibility

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star on GitHub! ⭐**

_Making parking simple, secure, and efficient for everyone._

**Built with ❤️ by Pritam Behera**

</div>
