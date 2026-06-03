# PulseForge

A robust Node.js/Express REST API built with TypeScript and PostgreSQL for managing users and issues with role-based access control.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Authorization & Permissions](#authorization--permissions)
- [Technologies Used](#technologies-used)
- [Scripts](#scripts)
- [License](#license)

## Overview

PulseForge is a comprehensive REST API application that provides user authentication and issue management capabilities with role-based access control. Built with Express.js and TypeScript, it follows modern architectural patterns with modular route organization, service layers, controller-based request handling, and JWT-based authentication.

## Features

✅ **User Authentication** - Secure user registration and login with JWT  
✅ **User Management** - Get and update user information  
✅ **Issue Tracking** - Create, read, update, and delete issues  
✅ **Issue Filtering** - Sort and filter issues by type and status  
✅ **Role-Based Access Control** - Different permissions for contributors and maintainers  
✅ **PostgreSQL Integration** - Persistent data storage with PostgreSQL  
✅ **TypeScript Support** - Fully typed codebase for type safety  
✅ **Modular Architecture** - Clean separation of concerns with dedicated modules  
✅ **RESTful API** - Standardized HTTP methods and status codes  
✅ **Environment Configuration** - Secure configuration management with .env  

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **PostgreSQL** (v12 or higher)
- **TypeScript** (v6.0.0 or higher)

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd PulseForge
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
CONNECTION_STRING=postgresql://user:password@localhost:5432/pulseforge_db

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_secret_key_here
```

4. **Initialize the database**

The application automatically creates the required tables on startup:
- **users** table - Stores user credentials and role information
- **issues** table - Stores issue tracking data with type and status constraints

## Project Structure

```
PulseForge/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts      # Request handlers for authentication
│   │   │   ├── auth.route.ts           # Authentication endpoints (signup, login)
│   │   │   └── auth.service.ts         # Business logic for user registration and login
│   │   ├── users/
│   │   │   ├── user.controller.ts      # Request handlers for user operations
│   │   │   ├── user.interface.ts       # IUser interface with fields: id, name, email, password, role
│   │   │   ├── user.route.ts           # User endpoints (GET, PUT, DELETE)
│   │   │   └── user.service.ts         # Business logic for user database operations
│   │   └── issues/
│   │       ├── issue.controller.ts     # Request handlers for issue operations
│   │       ├── issue.interface.ts      # IIssue interface with fields: title, description, type, status, reporter_id
│   │       ├── issue.route.ts          # Issue endpoints (CRUD operations)
│   │       └── issue.service.ts        # Business logic for issue database operations
│   ├── middleware/
│   │   ├── auth.ts                     # JWT authentication and role-based authorization middleware
│   │   ├── logger.ts                   # Request logging middleware
│   │   └── index.d.ts                  # TypeScript declarations
│   ├── config/
│   │   └── index.ts                    # Configuration: CONNECTION_STRING, PORT, JWT_SECRET
│   ├── db/
│   │   └── index.ts                    # PostgreSQL pool setup and table initialization
│   ├── types/
│   │   └── index.ts                    # TypeScript type definitions (USER_ROLE, ROLES)
│   ├── app.ts                          # Express app configuration and route registration
│   └── server.ts                       # Application entry point
├── .env                                # Environment variables
├── .gitignore                          # Git ignore patterns
├── package.json                        # Project dependencies and scripts
├── package-lock.json                   # Dependency lock file
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # Project documentation
```

### Module Architecture

Each module follows the **MVC pattern** with the following components:

- **Controller** - Handles HTTP requests/responses
- **Service** - Contains business logic
- **Route** - Defines API endpoints
- **Interface** - TypeScript type definitions

## Environment Setup

### Create `.env` File

```bash
# Root directory
cat > .env << EOF
CONNECTION_STRING=postgresql://username:password@localhost:5432/pulseforge_db
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
EOF
```

### Database Configuration

The database connection is configured in `src/config/index.ts` and uses the `CONNECTION_STRING` from your `.env` file. The database pool is initialized in `src/db/index.ts`, and tables are automatically created on application startup.

## Running the Application

### Development Mode

Run the application with hot-reload using tsx:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/auth/signup` | Register a new user | ❌ No |
| `POST` | `/auth/login` | Login and get JWT token | ❌ No |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `GET` | `/users` | Get all users | ✅ Yes (contributor/maintainer) |
| `GET` | `/users/:id` | Get user by ID | ❌ No |
| `PUT` | `/users/:id` | Update user by ID | ❌ No |
| `DELETE` | `/users/:id` | Delete user by ID | ❌ No |

### Issue Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|----------------|---------------|
| `POST` | `/issues` | Create a new issue | ✅ Yes | Contributor / Maintainer |
| `GET` | `/issues` | Get all issues with optional filters | ❌ No | - |
| `GET` | `/issues/:id` | Get issue by ID | ❌ No | - |
| `PUT` | `/issues/:id` | Update issue by ID | ✅ Yes | Contributor (own only) / Maintainer (any) |
| `DELETE` | `/issues/:id` | Delete issue by ID | ✅ Yes | Maintainer only |

## Authentication

### JWT Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login, you'll receive a token that must be included in the `Authorization` header for protected endpoints.

**Request Header Format:**
```
Authorization: <token>
```

### Example Authentication Flow

**1. Sign Up**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "contributor"
  }'
```

**2. Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor"
    }
  }
}
```

**3. Use Token in Protected Endpoints**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Authorization & Permissions

### User Roles

The application supports two user roles with different permission levels:

| Role | Description | Allowed Actions |
|------|-------------|-----------------|
| **Contributor** | Regular user who can report and manage their own issues | • Register and log in<br>• Create new issues<br>• Update their own issues<br>• View all issues |
| **Maintainer** | Administrator with full control over the system | • All contributor permissions<br>• Update any issue<br>• Delete any issue<br>• Change issue workflow status independently |

### Permission Details

**Contributor Permissions:**
- ✅ Register and log in
- ✅ Create new issues (bug or feature_request)
- ✅ Update only their own issues
- ✅ View all issues
- ❌ Cannot delete any issues
- ❌ Cannot update other users' issues

**Maintainer Permissions:**
- ✅ All contributor permissions
- ✅ Update any issue (not just own)
- ✅ Delete any issue
- ✅ Change issue workflow status independently
- ✅ View all issues with filtering

## API Examples

### User Endpoints

**Get All Users** (requires authentication)
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: <token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully!",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "contributor"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "maintainer"
    }
  ]
}
```

**Get User by ID**
```bash
curl http://localhost:3000/api/users/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully!",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "contributor"
  }
}
```

**Update a User**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "newPassword456",
    "role": "contributor"
  }'
```

**Delete a User**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Issue Endpoints

**Create an Issue** (requires authentication)
```bash
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: <token>" \
  -d '{
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Issue created successfully!",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

**Get All Issues with Filtering**
```bash
# Get issues sorted by newest (default)
curl http://localhost:3000/api/issues

# Get issues sorted by oldest
curl "http://localhost:3000/api/issues?sort=oldest"

# Filter by type
curl "http://localhost:3000/api/issues?type=bug"

# Filter by status
curl "http://localhost:3000/api/issues?status=open"

# Combine filters
curl "http://localhost:3000/api/issues?sort=newest&type=bug&status=in_progress"
```

**Query Parameters:**
| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `sort` | newest, oldest | newest | Sort order by creation date |
| `type` | bug, feature_request | (none) | Filter by issue type |
| `status` | open, in_progress, resolved | (none) | Filter by issue status |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Issues retrieved successfully!",
  "data": [
    {
      "id": 45,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00Z",
      "updated_at": "2026-01-20T14:45:00Z"
    }
  ]
}
```

**Get Issue by ID**
```bash
curl http://localhost:3000/api/issues/45
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Issue retrieved successfully!",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T14:45:00Z"
  }
}
```

**Update an Issue** (contributors can only update their own, maintainers can update any)
```bash
curl -X PUT http://localhost:3000/api/issues/45 \
  -H "Content-Type: application/json" \
  -H "Authorization: <token>" \
  -d '{
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries. Fixed in v2.1",
    "status": "resolved"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Issue updated successfully!",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries. Fixed in v2.1",
    "type": "bug",
    "status": "resolved",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T15:30:00Z"
  }
}
```

**Error Response - Contributor Updating Another's Issue (403 Forbidden):**
```json
{
  "success": false,
  "message": "You can only update your own issues!"
}
```

**Delete an Issue** (maintainer only)
```bash
curl -X DELETE http://localhost:3000/api/issues/45 \
  -H "Authorization: <token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Issue deleted successfully!"
}
```

### Valid Values Reference

**User Roles:**
- `contributor` - Regular user
- `maintainer` - Administrator

**Issue Type:**
- `bug` - Bug report
- `feature_request` - Feature request

**Issue Status:**
- `open` - New issue
- `in_progress` - Currently being worked on
- `resolved` - Issue has been fixed

## Technologies Used

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | ^5.2.1 | Web framework |
| **TypeScript** | ^6.0.3 | Type-safe JavaScript |
| **PostgreSQL** | 12+ | Database |
| **pg** | ^8.21.0 | PostgreSQL client |
| **jsonwebtoken** | ^9.0.3 | JWT authentication |
| **bcryptjs** | ^3.0.3 | Password hashing |
| **dotenv** | ^17.4.2 | Environment variables |
| **tsx** | ^4.22.3 | TypeScript execution |

## Scripts

```bash
# Start development server with hot-reload
npm run dev

# Run tests
npm test
```

## Development Workflow

1. **Create a new module** - Add a folder in `src/modules`
2. **Define interfaces** - Create `.interface.ts` for TypeScript types
3. **Implement service** - Write business logic in `.service.ts`
4. **Create controller** - Handle requests/responses in `.controller.ts`
5. **Define routes** - Set up endpoints in `.route.ts`
6. **Register router** - Import and use in `src/app.ts`

## Tips for Development

- Keep business logic in the service layer
- Use TypeScript interfaces for type safety
- Follow REST conventions for endpoint design
- Validate input data before processing
- Handle errors gracefully with appropriate HTTP status codes
- Use JWT tokens from the login endpoint for protected routes
- Always check user role in authorization logic for protected operations

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, change the `PORT` in your `.env` file.

### Database Connection Error
Ensure PostgreSQL is running and your `CONNECTION_STRING` is correctly configured.

### Authentication Token Expired or Invalid
Get a new token by logging in again with `/auth/login` endpoint.

### 403 Forbidden Error
Ensure you:
- Have the correct JWT token in the Authorization header
- Have the appropriate role for the operation (e.g., maintainer for delete)
- Are updating your own issue if you're a contributor

### TypeScript Compilation Error
Clear the `dist` folder and rebuild:
```bash
rm -rf dist
npm run build
```

## License

This project is licensed under the ISC License. See the LICENSE file for details.

---

**Happy Coding! 🚀**
