# 🚗 QuickPark - Smart Parking Management System

A comprehensive parking lot management system built with Spring Boot backend and vanilla JavaScript frontend, designed to efficiently manage vehicle parking, tracking, and billing operations.

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
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

QuickPark is a modern parking management solution that provides:

- **Real-time parking spot availability tracking**
- **Automated ticket generation and management**
- **Multi-tier vehicle classification (Mini, Compact, Large)**
- **Dynamic pricing based on vehicle type and duration**
- **Administrative dashboard with analytics**
- **Responsive web interface**

## ✨ Features

### Core Functionality

- ✅ **Vehicle Parking & Unparking**: Automated spot allocation with instant ticket generation
- ✅ **Real-time Status Tracking**: Live availability monitoring across all parking zones
- ✅ **Dynamic Pricing**: Automatic fee calculation based on parking duration
- ✅ **Ticket Management**: Update vehicle details, print tickets, and track history

### Administrative Features

- ✅ **Admin Dashboard**: Comprehensive analytics and management interface
- ✅ **Revenue Analytics**: Daily, weekly, and monthly revenue tracking
- ✅ **Vehicle Management**: View active and completed parking sessions
- ✅ **Utilization Statistics**: Parking usage distribution and trends
- ✅ **Gate Management**: Control and monitor entry/exit points

### Frontend Features

- ✅ **Responsive Design**: Mobile-friendly interface with modern UI
- ✅ **Real-time Updates**: Live parking status and availability
- ✅ **Print Functionality**: Generate physical tickets and bills
- ✅ **Form Validation**: Client-side validation with user feedback

## 🛠 Technology Stack

### Backend

- **Framework**: Spring Boot 3.4.2
- **Language**: Java 17
- **Database**: MongoDB
- **Build Tool**: Maven
- **Dependencies**:
  - Spring Boot Starter Web
  - Spring Boot Starter Data MongoDB
  - Jackson (JSON Processing)

### Frontend

- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Architecture**: Single Page Application (SPA) with multiple pages

### Tools & Utilities

- **Version Control**: Git
- **IDE**: IntelliJ IDEA / VS Code
- **API Testing**: Postman (recommended)

## 📁 Project Structure

```
ParkingLot/
├── 📁 Frontend/                     # Frontend application
│   ├── 📄 index.html               # Home page
│   ├── 📄 park.html                # Vehicle parking interface
│   ├── 📄 unpark.html              # Vehicle unparking interface
│   ├── 📄 status.html              # Real-time status dashboard
│   ├── 📄 admin-login.html         # Admin authentication
│   ├── 📄 admin.html               # Admin management dashboard
│   ├── 📄 script.js                # JavaScript functionality
│   └── 📄 style.css                # Stylesheet
├── 📁 src/main/java/com/quickpark/parkinglot/
│   ├── 📁 config/                   # Configuration classes
│   │   └── 📄 WebConfig.java        # CORS and web configuration
│   ├── 📁 contoller/               # REST API controllers
│   │   ├── 📄 ParkingController.java # Main parking operations
│   │   └── 📄 GateController.java   # Gate management
│   ├── 📁 DTO/                     # Data Transfer Objects
│   │   ├── 📄 BookRequest.java      # Parking request model
│   │   └── 📄 FreeRequest.java      # Unparking response model
│   ├── 📁 entities/                # Database entities
│   │   ├── 📄 Ticket.java           # Parking ticket model
│   │   ├── 📄 ParkingSpot.java      # Parking spot model
│   │   ├── 📄 ParkingLot.java       # Parking lot model
│   │   ├── 📄 Gate.java             # Gate model
│   │   ├── 📄 DisplayBoard.java     # Display board model
│   │   ├── 📄 MiniParkingSpot.java  # Mini vehicle spots
│   │   ├── 📄 CompactParkingSpot.java # Compact vehicle spots
│   │   └── 📄 LargeParkingSpot.java # Large vehicle spots
│   ├── 📁 repository/              # Data access layer
│   │   ├── 📄 TicketRepository.java # Ticket data operations
│   │   └── 📄 GateRepository.java   # Gate data operations
│   ├── 📁 response/                # Response models
│   │   └── 📄 DisplayResponse.java  # API response wrapper
│   ├── 📁 service/                 # Business logic layer
│   │   ├── 📄 ParkingService.java   # Main parking service
│   │   ├── 📄 IParkingService.java  # Parking service interface
│   │   ├── 📄 GateService.java      # Gate management service
│   │   └── 📄 IGateService.java     # Gate service interface
│   └── 📄 ParkinglotApplication.java # Main application class
├── 📁 src/main/resources/
│   └── 📄 application.properties    # Application configuration
├── 📄 pom.xml                      # Maven configuration
└── 📄 README.md                    # Project documentation
```

## 📋 Prerequisites

Before running this application, ensure you have:

- **Java 17** or higher
- **Maven 3.6+** for dependency management
- **MongoDB** database server running
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ParkingLot.git
cd ParkingLot
```

### 2. Database Setup

Ensure MongoDB is running on your system:

```bash
# Start MongoDB service (varies by OS)
# Windows: net start MongoDB
# macOS: brew services start mongodb/brew/mongodb-community
# Linux: sudo systemctl start mongod
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/quickpark
```

### 4. Backend Setup

```bash
# Build the project
mvn clean compile

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 5. Frontend Setup

Open the frontend in a local server:

```bash
# Using Python (if installed)
cd Frontend
python -m http.server 5500

# Or using Node.js live-server
npm install -g live-server
cd Frontend
live-server --port=5500
```

The frontend will be available at `http://localhost:5500`

## ⚙️ Configuration

### Application Properties

```properties
# Application name
spring.application.name=parkinglot

# JSON serialization settings
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone=UTC

# MongoDB connection
spring.data.mongodb.uri=${MONGODB_URI}
```

### Parking Lot Configuration

- **Mini Spots**: 50 (for motorcycles, compact cars)
- **Compact Spots**: 75 (for standard cars)
- **Large Spots**: 25 (for SUVs, trucks)
- **Total Capacity**: 150 vehicles

### Pricing Structure

- **First 30 minutes**: Free
- **Mini vehicles**: ₹20/hour
- **Compact vehicles**: ₹35/hour
- **Large vehicles**: ₹50/hour

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint                              | Description                 |
| ------ | ------------------------------------- | --------------------------- |
| GET    | `/quickpark/home`                     | Welcome message             |
| GET    | `/quickpark/free-parking-spots`       | Get available parking spots |
| POST   | `/quickpark/park`                     | Park a vehicle              |
| DELETE | `/quickpark/unpark`                   | Unpark a vehicle            |
| PUT    | `/quickpark/update-ticket/{ticketId}` | Update vehicle details      |

### Admin Endpoints

| Method | Endpoint                                                | Description                      |
| ------ | ------------------------------------------------------- | -------------------------------- |
| GET    | `/quickpark/admin/validate-admin/{username}/{password}` | Admin authentication             |
| GET    | `/quickpark/admin/active-vehicles`                      | Get currently parked vehicles    |
| GET    | `/quickpark/admin/completed-vehicles`                   | Get completed parking sessions   |
| GET    | `/quickpark/admin/all-vehicles`                         | Get all vehicles history         |
| GET    | `/quickpark/admin/unparked-today`                       | Count of vehicles unparked today |
| GET    | `/quickpark/admin/revenue-today`                        | Today's revenue                  |
| GET    | `/quickpark/admin/revenue-week`                         | Weekly revenue                   |
| GET    | `/quickpark/admin/revenue-month`                        | Monthly revenue                  |
| GET    | `/quickpark/admin/parking-statistics`                   | Parking utilization statistics   |

## 🌐 Frontend Pages

### User Interface

- **🏠 Home (`index.html`)**: Landing page with parking overview and navigation
- **🅿️ Park (`park.html`)**: Vehicle parking form with real-time validation
- **🚗 Unpark (`unpark.html`)**: Vehicle retrieval and bill generation
- **📊 Status (`status.html`)**: Real-time parking availability dashboard

### Administrative Interface

- **🔐 Admin Login (`admin-login.html`)**: Secure authentication for administrators
- **📈 Admin Dashboard (`admin.html`)**: Comprehensive management interface with:
  - Vehicle management (active/completed)
  - Revenue analytics (daily/weekly/monthly)
  - Parking utilization statistics
  - Gate management
  - System overview

## 🗄️ Database Schema

### Ticket Collection

```json
{
  "_id": "string",
  "ownerName": "string",
  "ownerContact": "string",
  "entryTime": "HH:mm",
  "exitTime": "HH:mm",
  "entryDate": "yyyy-MM-dd",
  "exitDate": "yyyy-MM-dd",
  "vehicleNo": "string",
  "completed": "boolean",
  "parkingSpot": {
    "location": "number",
    "type": "string",
    "cost": "number",
    "booked": "boolean"
  }
}
```

### Gate Collection

```json
{
  "_id": "string",
  "gateId": "string",
  "gateName": "string",
  "gateType": "string",
  "guardName": "string",
  "isActive": "boolean"
}
```

## 📖 Usage

### For End Users

1. **Parking a Vehicle**:

   - Navigate to the parking page
   - Select vehicle type (Mini/Compact/Large)
   - Enter vehicle details (number, owner name, contact)
   - Submit to receive parking ticket
   - Print ticket for future reference

2. **Unparking a Vehicle**:

   - Go to unpark page
   - Enter 10-digit ticket ID
   - Review and print bill
   - Pay applicable charges

3. **Checking Status**:
   - Visit status page for real-time availability
   - View parking distribution across zones
   - Monitor occupancy rates

### For Administrators

1. **Login**: Use admin credentials (username: `admin`, password: `admin123`)
2. **Dashboard**: Monitor system overview and key metrics
3. **Vehicle Management**: View active/completed parking sessions
4. **Analytics**: Track revenue trends and utilization patterns
5. **System Management**: Configure gates and system settings

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Guidelines

- Follow Java naming conventions
- Write meaningful commit messages
- Include tests for new features
- Update documentation for API changes
- Ensure responsive design for frontend changes

## 📞 Support

For support and queries:

- **Email**: support@quickpark.com
- **Phone**: +91 86585 35505
- **Address**: 123 Smart City Avenue, Tech District, TC 12345

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- MongoDB for reliable database solution
- Contributors and testers who helped improve the system

---

_Making parking simple, secure, and efficient for everyone._
