# NBA API Documentation

## Overview

The NBA API is a RESTful web service built with PHP following SOLID principles. It provides user authentication and profile management functionality with JWT-based security.

**Base URL:** `http://localhost/nba/api/`

## Authentication

All API requests (except login) require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 1. User Login

**Endpoint:** `POST /login`

**Description:** Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "employeeIdOrEmail": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "employee_id": 3001,
      "username": "Dr. Nityananda Sarma",
      "email": "nityananda@tezu.ernet.in",
      "role": "faculty",
      "department_id": 1,
      "department_name": "Computer Science & Engineering",
      "department_code": "CSE"
    }
  }
}
```

**Note:** If the user has no department (`department_id` is `null`), the `department_name` and `department_code` fields will not be included in the response.

**Example for Admin (no department):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "employee_id": 1001,
      "username": "System Administrator",
      "email": "admin@tezu.edu",
      "role": "admin",
      "department_id": null
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Employee ID or email is required",
    "Password is required"
  ]
}
```

### 2. Get User Profile

**Endpoint:** `GET /profile`

**Description:** Retrieve the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "employee_id": 1,
    "username": "admin",
    "email": "admin@nba.edu",
    "role": "admin",
    "department_id": null
  }
}
```

**Unauthorized Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized access",
  "error": "Invalid or missing authentication token"
}
```

### 3. Update User Profile

**Endpoint:** `PUT /profile`

**Description:** Update the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```

**Important:** Users **cannot** change their `department_id`. Any attempt to include `department_id` in the request will result in a validation error.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "employee_id": 1,
    "username": "newusername",
    "email": "newemail@nba.edu",
    "role": "admin",
    "department_id": 2
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Username must be at least 3 characters long",
    "Invalid email format",
    "Department cannot be changed by user"
  ]
}
```

**Conflict Error Response (409):**
```json
{
  "success": false,
  "message": "Username already exists"
}
```

### 4. User Logout

**Endpoint:** `POST /logout`

**Description:** Logout the authenticated user (client-side token invalidation).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Data Models

**Endpoint:** `GET /department`

**Description:** Retrieve department information for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Department information retrieved successfully",
  "data": {
    "department_id": 1,
    "department_name": "Computer Science",
    "department_code": "CS"
  }
}
```

**Success Response (200) - No Department:**
```json
{
  "success": true,
  "message": "Department information retrieved successfully",
  "data": null
}
```

**Unauthorized Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized access",
  "error": "Invalid or missing authentication token"
}
```

### User Object
```json
{
  "employee_id": "number",
  "username": "string (full name)",
  "email": "string",
  "role": "string",
  "department_id": "number|null"
}
```

### Department Object
```json
{
  "department_id": "number",
  "department_name": "string",
  "department_code": "string"
}
```

## Validation Rules

### Login Validation
- `employeeIdOrEmail`: Required
- `password`: Required

### Profile Update Validation
- `username`: Optional, minimum 2 characters (full name)
- `email`: Optional, valid email format
- `password`: Optional, minimum 6 characters
- `role`: Optional, must be one of: `admin`, `dean`, `hod`, `faculty`, `staff`
- `department_id`: Optional, positive number or null

## User Roles

- `admin`: System administrator
- `dean`: Academic dean
- `hod`: Head of department
- `faculty`: Teaching faculty member
- `staff`: Administrative staff

## Sample Test Data

After running the database setup, the following test users are available:

| Employee ID | Full Name           | Email              | Role    | Department          |
|-------------|---------------------|--------------------|---------|---------------------|
| 1001        | System Administrator| admin@nba.edu      | admin   | None                |
| 2001        | John Doe            | john.doe@nba.edu   | faculty | Computer Science    |
| 3001        | Jane Doe            | jane.doe@nba.edu   | staff   | Administration      |
| 4001        | Bob Smith           | bob.smith@nba.edu  | hod     | Information Technology |

## Departments

| ID | Name                  | Code  |
|----|-----------------------|-------|
| 1  | Computer Science      | CS    |
| 2  | Information Technology| IT    |
| 3  | Mechanical Engineering| ME    |
| 4  | Electrical Engineering| EE    |
| 5  | Administration        | ADMIN |

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "string",
  "data": "object|array|null"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "string",
  "error": "string", // optional
  "errors": "array"  // optional, for validation errors
}
```

## HTTP Status Codes

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## CORS Support

The API includes CORS headers to support cross-origin requests from web applications:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input sanitization and validation
- SQL injection prevention with prepared statements
- XSS protection with input sanitization