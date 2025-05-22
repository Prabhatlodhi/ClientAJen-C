# Agency-Client REST API 🚀

A comprehensive Node.js REST API with JWT authentication for managing Agencies and Clients, built with Express.js and MongoDB.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)

## 📋 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Payload Structures](#-payload-structures)
- [Sample Requests](#-sample-requests)
- [Authentication](#-authentication)
- [Error Handling](#-error-handling)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## ✨ Features

- 🔐 **JWT Token-based Authentication**
- 🏢 **Agency Management** with complete CRUD operations
- 👥 **Client Management** linked to agencies
- 📊 **Advanced Queries** (Top clients with maximum bills)
- ✅ **Input Validation** with comprehensive error handling
- 🛡️ **Security** with bcrypt, helmet, and CORS
- 📝 **Request Logging** with Morgan
- 🚀 **Production Ready** deployment on Heroku
- 💾 **Cloud Database** with MongoDB Atlas

## 🌐 Live Demo

**Base URL:** `https://clientajen-c.onrender.com`

**Health Check:** [https://clientajen-c.onrender.com/](https://clientajen-c.onrender.com/)

## ⚡ Quick Start

### Test the API in 3 Steps:

1. **Register a User:**
```bash
curl -X POST https://clientajen-c.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

2. **Login to Get Token:**
```bash
curl -X POST https://clientajen-c.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

3. **Use Token for Protected Endpoints:**
```bash
curl -X GET https://clientajen-c.onrender.com/api/agencies/top-clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |

### 🏢 Agencies

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/agencies/create-with-client` | Create agency + client | ✅ |
| `GET` | `/api/agencies/top-clients` | Get top clients by bill | ✅ |

### 👥 Clients

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `PUT` | `/api/clients/{clientId}` | Update client details | ✅ |
| `GET` | `/api/clients/{clientId}` | Get single client | ✅ |
| `GET` | `/api/clients` | Get all clients | ✅ |

## 📝 Payload Structures

### 🔐 Authentication Payloads

#### Register User
```json
{
  "username": "string (required, unique)",
  "email": "string (required, unique, valid email)",
  "password": "string (required, min 6 characters)"
}
```

#### Login User
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

### 🏢 Agency Payload
```json
{
  "agencyId": "string (required, unique)",
  "name": "string (required)",
  "address1": "string (required)",
  "address2": "string (optional)",
  "state": "string (required)",
  "city": "string (required)",
  "phoneNumber": "string (required)"
}
```

### 👥 Client Payload
```json
{
  "clientId": "string (required, unique)",
  "agencyId": "string (required, must exist)",
  "name": "string (required)",
  "email": "string (required, valid email)",
  "phoneNumber": "string (required)",
  "totalBill": "number (required, >= 0)"
}
```

### 🏢📊 Combined Agency + Client Payload
```json
{
  "agency": {
    "agencyId": "AG001",
    "name": "Digital Marketing Pro",
    "address1": "123 Business Street",
    "address2": "Suite 400",
    "state": "Maharashtra",
    "city": "Mumbai",
    "phoneNumber": "9876543210"
  },
  "client": {
    "clientId": "CL001",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phoneNumber": "9876543211",
    "totalBill": 25000
  }
}
```

## 🧪 Sample Requests

### 1. User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

### 2. User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Create Agency + Client (Single Request) ⭐
```bash
POST /api/agencies/create-with-client
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "agency": {
    "agencyId": "AG001",
    "name": "Creative Solutions Ltd",
    "address1": "456 Innovation Drive",
    "address2": "Floor 3",
    "state": "Karnataka",
    "city": "Bangalore",
    "phoneNumber": "9876543210"
  },
  "client": {
    "clientId": "CL001",
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "phoneNumber": "9876543211",
    "totalBill": 35000
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Agency and client created successfully",
  "data": {
    "agency": {
      "agencyId": "AG001",
      "name": "Creative Solutions Ltd",
      "address1": "456 Innovation Drive",
      "address2": "Floor 3",
      "state": "Karnataka",
      "city": "Bangalore",
      "phoneNumber": "9876543210",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "client": {
      "clientId": "CL001",
      "agencyId": "AG001",
      "name": "Priya Sharma",
      "email": "priya.sharma@example.com",
      "phoneNumber": "9876543211",
      "totalBill": 35000,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 4. Update Client Details ⭐
```bash
PUT /api/clients/CL001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Priya Sharma Updated",
  "email": "priya.updated@example.com",
  "phoneNumber": "9876543212",
  "totalBill": 45000
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "clientId": "CL001",
    "agencyId": "AG001",
    "name": "Priya Sharma Updated",
    "email": "priya.updated@example.com",
    "phoneNumber": "9876543212",
    "totalBill": 45000,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 5. Get Top Clients with Maximum Bill ⭐
```bash
GET /api/agencies/top-clients
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Top clients retrieved successfully",
  "data": [
    {
      "AgencyName": "Creative Solutions Ltd",
      "ClientName": "Priya Sharma Updated",
      "TotalBill": 45000
    },
    {
      "AgencyName": "Marketing Experts",
      "ClientName": "Amit Patel",
      "TotalBill": 42000
    }
  ]
}
```

### 6. Get Single Client
```bash
GET /api/clients/CL001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clientId": "CL001",
    "agencyId": "AG001",
    "name": "Priya Sharma Updated",
    "email": "priya.updated@example.com",
    "phoneNumber": "9876543212",
    "totalBill": 45000,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

## 🔐 Authentication

All protected endpoints require a **Bearer token** in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Lifecycle
- **Expiration:** 7 days
- **Format:** JWT (JSON Web Token)
- **Algorithm:** HS256

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Description | Example Scenario |
|------|-------------|------------------|
| `200` | OK | Successful GET, PUT requests |
| `201` | Created | Successful POST requests |
| `400` | Bad Request | Validation errors, duplicate data |
| `401` | Unauthorized | Missing/invalid token |
| `404` | Not Found | Resource not found |
| `500` | Internal Server Error | Database/server errors |

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages array"]
}
```

### Sample Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Unauthorized Error (401)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "message": "Client not found"
}
```

#### Duplicate Entry Error (400)
```json
{
  "success": false,
  "message": "agencyId already exists"
}
```

## 🛠️ Installation

### Prerequisites
- Node.js 18.x or higher
- MongoDB (local or Atlas)
- npm or yarn

### Local Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/agency-client-api.git
cd agency-client-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agency-client-db
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

4. **Start MongoDB:**
```bash
# Local MongoDB
mongod

# Or MongoDB service (Linux)
sudo systemctl start mongod

# Or MongoDB service (macOS)
brew services start mongodb/brew/mongodb-community
```

5. **Start the server:**
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

6. **Test the API:**
```bash
curl http://localhost:5000/
```

## 📦 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment | `development` | ❌ |
| `PORT` | Server port | `5000` | ❌ |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/agency-client-db` | ✅ |
| `JWT_SECRET` | JWT signing secret | `fallback-secret` | ✅ |
| `JWT_EXPIRES_IN` | Token expiration | `7d` | ❌ |

## 📁 Project Structure

```
agency-client-api/
│
├── src/
│   ├── controllers/           # Business logic
│   │   ├── authController.js     # Authentication logic
│   │   ├── agencyController.js   # Agency operations
│   │   └── clientController.js   # Client operations
│   │
│   ├── models/               # MongoDB schemas
│   │   ├── User.js              # User model with auth
│   │   ├── Agency.js            # Agency schema
│   │   └── Client.js            # Client schema
│   │
│   ├── routes/               # API route definitions
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── agencyRoutes.js      # Agency endpoints
│   │   └── clientRoutes.js      # Client endpoints
│   │
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js              # JWT verification
│   │   ├── validation.js        # Input validation
│   │   └── errorHandler.js      # Error handling
│   │
│   ├── config/               # Configuration
│   │   └── database.js          # MongoDB connection
│   │
│   └── utils/                # Helper functions
│       ├── constants.js         # App constants
│       └── helpers.js           # Utility functions
│
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies & scripts
├── README.md               # This file
└── server.js               # Application entry point
```

## 🧪 Testing with Postman

### Import Collection
1. Create new collection: "Agency-Client API"
2. Set environment variables:
   - `baseURL`: `https://clientajen-c.onrender.com`
   - `token`: `{{token}}`

### Pre-request Script (for login)
```javascript
pm.test("Save token", function () {
    var jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.token) {
        pm.environment.set("token", jsonData.data.token);
    }
});
```

### Authorization Setup
For protected routes:
- **Type:** Bearer Token
- **Token:** `{{token}}`

## 🚀 Deployment

### Heroku Deployment

1. **Install Heroku CLI**
2. **Login to Heroku:**
```bash
heroku login
```

3. **Create Heroku app:**
```bash
heroku create your-app-name
```

4. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-atlas-connection-string
heroku config:set JWT_SECRET=your-production-secret
```

5. **Deploy:**
```bash
git push heroku main
```

### Alternative Platforms
- **Railway:** Connect GitHub repo, set env vars, deploy
- **Render:** Connect repo, configure build/start commands
- **Vercel:** Add `vercel.json`, deploy with CLI

## 🔍 API Testing Guide

### Complete Test Sequence

1. **Health Check**
```bash
curl https://clientajen-c.onrender.com/
```

2. **Register User**
```bash
curl -X POST https://clientajen-c.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "tester", "email": "test@example.com", "password": "password123"}'
```

3. **Login & Save Token**
```bash
curl -X POST https://clientajen-c.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

4. **Create Agency + Client**
```bash
curl -X POST https://clientajen-c.onrender.com/api/agencies/create-with-client \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"agency": {"agencyId": "AG001", "name": "Test Agency", "address1": "123 St", "state": "MH", "city": "Mumbai", "phoneNumber": "1234567890"}, "client": {"clientId": "CL001", "name": "Test Client", "email": "client@test.com", "phoneNumber": "9876543210", "totalBill": 15000}}'
```

5. **Update Client**
```bash
curl -X PUT https://clientajen-c.onrender.com/api/clients/CL001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"totalBill": 20000}'
```

6. **Get Top Clients**
```bash
curl -X GET https://clientajen-c.onrender.com/api/agencies/top-clients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the robust database
- JWT.io for authentication standards
- Heroku for deployment platform

---

**⭐ Star this repository if you found it helpful!**
