# PulseForge

A robust Node.js/Express REST API built with TypeScript and PostgreSQL for managing users and issues.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Scripts](#scripts)
- [License](#license)

## Overview

PulseForge is a comprehensive REST API application that provides user and issue management capabilities. Built with Express.js and TypeScript, it follows modern architectural patterns with modular route organization, service layers, and controller-based request handling.

## Features

✅ **User Management** - Create, read, update, and delete users  
✅ **Issue Tracking** - Create, read, update, and delete issues  
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
```

4. **Initialize the database**

Create your PostgreSQL database and run any necessary migrations.

## Project Structure

```
PulseForge/
├── src/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── user.controller.ts      # Request handlers for user operations
│   │   │   ├── user.interface.ts       # IUser interface with fields: name, email, password, role
│   │   │   ├── user.route.ts           # User endpoints (CRUD operations)
│   │   │   └── user.service.ts         # Business logic for user database operations
│   │   └── issues/
│   │       ├── issue.controller.ts     # Request handlers for issue operations
│   │       ├── issue.interface.ts      # IIssue interface with fields: title, description, type, status, reporter_id
│   │       ├── issue.route.ts          # Issue endpoints (CRUD operations)
│   │       └── issue.service.ts        # Business logic for issue database operations
│   ├── config/
│   │   └── index.ts                    # Configuration: CONNECTION_STRING, PORT
│   ├── db/
│   │   └── index.ts                    # PostgreSQL pool setup and table initialization
│   ├── app.ts                          # Express app configuration and route registration
│   └── server.ts                       # Application entry point
├── .env                                # Environment variables (CONNECTION_STRING, PORT)
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
EOF
```

### Database Configuration

The database connection is configured in `src/config/index.ts`:

```typescript
const config = {
    connection_string: process.env.CONNECTION_STRING as string,
    port: process.env.PORT || 3000,
}
```

The database pool is initialized in `src/db/index.ts` with the `CONNECTION_STRING` from your `.env` file, and tables are automatically created on application startup:

- **users** table: Stores user credentials and role information
- **issues** table: Stores issue tracking data with type and status constraints

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

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users` | Create a new user |
| `GET` | `/users` | Get all users |
| `GET` | `/users/:id` | Get user by ID |
| `PUT` | `/users/:id` | Update user by ID |
| `DELETE` | `/users/:id` | Delete user by ID |

### Issue Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/issues` | Create a new issue |
| `GET` | `/issues` | Get all issues |
| `GET` | `/issues/:id` | Get issue by ID |
| `PUT` | `/issues/:id` | Update issue by ID |
| `DELETE` | `/issues/:id` | Delete issue by ID |

### Example Requests

**Create a User**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "role": "admin"
  }'
```

**Get All Users**
```bash
curl http://localhost:3000/api/users
```

**Get User by ID**
```bash
curl http://localhost:3000/api/users/1
```

**Update a User**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "newPassword456",
    "role": "user"
  }'
```

**Delete a User**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

**Create an Issue**
```bash
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login page not loading",
    "description": "The login page fails to load when accessed from mobile devices",
    "type": "bug",
    "status": "open",
    "reporter_id": 1
  }'
```

**Get All Issues**
```bash
curl http://localhost:3000/api/issues
```

**Get Issue by ID**
```bash
curl http://localhost:3000/api/issues/1
```

**Update an Issue**
```bash
curl -X PUT http://localhost:3000/api/issues/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login page not loading",
    "description": "The login page fails to load when accessed from mobile devices. Fixed in v2.1",
    "type": "bug",
    "status": "in_progress",
    "reporter_id": 1
  }'
```

**Delete an Issue**
```bash
curl -X DELETE http://localhost:3000/api/issues/1
```

### Valid Values Reference

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
| **Node.js** | - | JavaScript runtime |
| **Express** | ^5.2.1 | Web framework |
| **TypeScript** | ^6.0.3 | Type-safe JavaScript |
| **PostgreSQL** | - | Database |
| **pg** | ^8.21.0 | PostgreSQL client |
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

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, change the `PORT` in your `.env` file.

### Database Connection Error
Ensure PostgreSQL is running and your `DATABASE_URL` is correctly configured.

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
