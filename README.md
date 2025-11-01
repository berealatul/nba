# NBA API Backend

A PHP-based RESTful API for NBA (National Basketball Association) user management system, built following SOLID principles with independent components.

## Features

- **User Authentication**: JWT-based login system
- **User Management**: Profile retrieval and updates
- **Department Management**: Users can be assigned to departments
- **Role-based Access**: Support for admin, dean, hod, faculty, and staff roles
- **RESTful API**: Following REST principles
- **SOLID Principles**: Clean architecture with independent components
- **CORS Support**: Cross-origin resource sharing enabled
- **Input Validation**: Comprehensive validation middleware
- **Error Handling**: Proper error responses and logging

## Architecture

The project follows SOLID principles with clear separation of concerns:

### Components

- **Models**: Data entities (User, UserRepository)
- **Services**: Business logic (AuthService, JWTService)
- **Controllers**: HTTP request handling (UserController)
- **Middleware**: Cross-cutting concerns (AuthMiddleware, ValidationMiddleware, CorsMiddleware)
- **Config**: Database configuration (DatabaseConfig)
- **Routes**: Request routing (Router)

## API Endpoints

### Authentication
- `POST /nba/api/login` - User login
- `POST /nba/api/logout` - User logout

### User Profile
- `GET /nba/api/profile` - Get user profile (requires authentication)
- `PUT /nba/api/profile` - Update user profile (requires authentication)

## Setup Instructions

### Prerequisites
- XAMPP with PHP 7.4+ and MySQL
- Web server (Apache) with mod_rewrite enabled

### Installation

1. **Clone/Download the project** to `C:\xampp\htdocs\nba\`

2. **Start XAMPP** and ensure Apache and MySQL are running

3. **Setup Database**:
   - Open browser and go to: `http://localhost/nba/api/setup_database.php`
   - This will create the database and insert sample users

4. **Test the API**:
   - Use tools like Postman or curl to test endpoints
   - Base URL: `http://localhost/nba/api/`

### Sample API Usage

#### Login
```bash
curl -X POST http://localhost/nba/api/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "admin", "password": "admin123"}'
```

#### Get Profile (requires token)
```bash
curl -X GET http://localhost/nba/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Profile (requires token)
```bash
curl -X PUT http://localhost/nba/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "newusername"}'
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    employee_id INT(11) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'dean', 'hod', 'faculty', 'staff') NOT NULL,
    department_id INT(11) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_department_id (department_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);
```

### Departments Table
```sql
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    department_code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Input sanitization and validation
- CORS protection
- SQL injection prevention with prepared statements

## Development Notes

- All components are designed to be independent and testable
- Follows dependency injection pattern
- Comprehensive error handling and validation
- Clean code with proper documentation

## Testing

Use the sample users created during setup:
- **Admin**: employee_id: `1001` or email: `admin@nba.edu` / password: `admin123` (no department)
- **Faculty**: employee_id: `2001` or email: `john.doe@nba.edu` / password: `password123` (Computer Science)
- **Staff**: employee_id: `3001` or email: `jane.doe@nba.edu` / password: `password123` (Administration)
- **HOD**: employee_id: `4001` or email: `bob.smith@nba.edu` / password: `password123` (Information Technology)

### Available Departments:
- ID: 1 - Computer Science (CS)
- ID: 2 - Information Technology (IT)
- ID: 3 - Mechanical Engineering (ME)
- ID: 4 - Electrical Engineering (EE)
- ID: 5 - Administration (ADMIN)

## Production Deployment

For production deployment:
1. Change JWT secret key in `JWTService.php`
2. Update database credentials in `DatabaseConfig.php`
3. Disable error reporting in `index.php`
4. Configure proper CORS origins in `CorsMiddleware.php`
5. Remove or secure `setup_database.php`