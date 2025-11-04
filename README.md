# NBA Accreditation Management System# NBA Accreditation Management System



A comprehensive PHP-based REST API for managing NBA (National Board of Accreditation) assessment data for educational institutions.A comprehensive PHP-based API system for managing NBA (National Board of Accreditation) assessment data including courses, tests, questions, and CO-based marks management.



## What is this?---



This system is a backend API that enables faculty to:## 🎯 Project Overview

- **Manage Courses**: Create and track courses with year/semester information

- **Create Assessments**: Design tests with up to 20 questions mapped to Course Outcomes (CO1-CO6)This system provides a complete backend API for educational institutions to manage:

- **Enter Marks**: Record student marks per question with automatic CO aggregation- **Course Management**: Create and manage courses with flexible year/semester system

- **Track Students**: Bulk enroll students and manage enrollments- **Assessment Management**: Create tests with up to 20 questions per test

- **Store Documents**: Upload and manage question papers and syllabus in PDF format- **CO Mapping**: Map each question to Course Outcomes (CO1-CO6)

- **Full Control**: Complete CRUD operations for questions and marks management- **Marks Management**: Dual storage system (per-question + CO-aggregated marks)

- **Role-Based Access**: Admin, HOD, Faculty, and Staff roles with JWT authentication

## Key Features

### Key Features

✅ **CO-Based Assessment**: Map each question to Course Outcomes (CO1-CO6) with automatic aggregation  - ✅ **Dynamic Questions**: Up to 20 questions and 7 sub-question per test with individual max marks

✅ **Dual Marks Storage**: Per-question raw marks + CO-aggregated totals  - ✅ **CO-Based Assessment**: Automatic CO aggregation from question-level marks

✅ **Bulk Operations**: Enroll multiple students and enter marks in bulk  - ✅ **Dual Marks Storage**: Per-question detail (rawMarks) + CO totals (marks)

✅ **CRUD Operations**: Update/delete questions and marks entries  - ✅ **Full CRUD Operations**: Complete control over questions and marks management

✅ **PDF Storage**: Dynamic filename generation for question papers and syllabus  - ✅ **PDF Storage**: Store question papers and syllabus with dynamic filenames

✅ **JWT Authentication**: Secure role-based access (Admin, HOD, Faculty, Staff)  - ✅ **Bulk Operations**: Bulk student enrollment and marks entry

✅ **RESTful API**: Clean, documented endpoints ready for frontend integration  - ✅ **JWT Authentication**: Secure token-based authentication

- ✅ **CORS Enabled**: Ready for frontend integration (React/Vue/Angular)

## Technology Stack- ✅ **Clean Architecture**: MVC pattern with SOLID principles



- **Backend**: PHP 8.2.12 with MVC architecture---

- **Database**: MySQL 8.0+ with 8 tables

- **Authentication**: JWT (JSON Web Tokens)## 🛠️ Technology Stack

- **Server**: Apache 2.4 (XAMPP)

- **API Design**: RESTful with CORS support### Backend

- **PHP**: 8.2.12

## Quick Start- **Architecture**: MVC with SOLID principles

- **Authentication**: JWT (JSON Web Tokens)

### 1. Setup Database- **Database**: MySQL 8.0+

```sql- **Server**: Apache 2.4 (XAMPP)

-- Create database- **Routing**: Custom router with mod_rewrite

CREATE DATABASE nba_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

### Database

-- Import schema using phpMyAdmin- **Tables**: 8 (departments, users, course, test, question, student, rawMarks, marks)

-- File: docs/db.sql

```### Frontend (Separate Project)

- **Compatible with**: React, Vue, Angular, or any modern frontend

### 2. Configure Connection

Edit `api/config/DatabaseConfig.php` (default XAMPP settings work):---

```php

private $host = 'localhost';## 📋 Prerequisites

private $db_name = 'nba_db';

private $username = 'root';Before installation, ensure you have:

private $password = '';- XAMPP (or equivalent: Apache + PHP 8.2+ + MySQL)

```- Postman (optional, for API testing)



### 3. Test Installation---

Open browser: `http://localhost/nba/api/`  

Expected: `{"message": "NBA Assessment API v1.0"}`## 🚀 Installation & Setup



### 4. Login (Default Admin)### Step 1: Clone/Download Project

```bash```bash

POST http://localhost/nba/api/login# If using Git

{git clone <repository-url> c:\xampp\htdocs\nba

  "employeeIdOrEmail": "admin@nba.edu",

  "password": "admin123"# Or manually extract to c:\xampp\htdocs\nba

}```

```

### Step 2: Database Setup

## API Endpoints1. Start XAMPP and ensure Apache + MySQL are running

2. Open phpMyAdmin (http://localhost/phpmyadmin)

**17+ RESTful endpoints** across 5 categories:3. Create new database:

   ```sql

| Category | Endpoints | Purpose |   CREATE DATABASE nba_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

|----------|-----------|---------|   ```

| **Authentication** | 4 | Login, register, profile |4. Import schema:

| **Courses** | 5 | Course and test management |   - Click on `nba_db` database

| **Assessments** | 3 | Create tests with CO mapping |   - Go to **Import** tab

| **Marks** | 9 | Individual/bulk entry, CRUD |   - Choose file: `docs/db.sql`

| **Enrollment** | 2 | Bulk student enrollment |   - Click **Go**



## Documentation### Step 3: Configure Database Connection

Edit `api/config/Database.php` if needed (default settings work with XAMPP):

📖 **Quick API Reference**: [`docs/APIDocumentation.md`](docs/APIDocumentation.md) - Input/output for all endpoints  ```php

🔧 **CRUD Operations**: [`docs/CRUD_OPERATIONS.md`](docs/CRUD_OPERATIONS.md) - Update/delete guide  private $host = 'localhost';

📦 **Bulk Features**: [`docs/BULK_MARKS_FEATURE.md`](docs/BULK_MARKS_FEATURE.md) - Bulk operations  private $db_name = 'nba_db';

👥 **Enrollment**: [`docs/ENROLLMENT_FEATURE.md`](docs/ENROLLMENT_FEATURE.md) - Student enrollment  private $username = 'root';

🗄️ **Database Schema**: [`docs/schema.md`](docs/schema.md) - Database structure  private $password = '';

⚡ **Quick Reference**: [`docs/QUICK_REFERENCE.md`](docs/QUICK_REFERENCE.md) - Developer cheat sheet  ```

📝 **Implementation**: [`docs/IMPLEMENTATION_SUMMARY.md`](docs/IMPLEMENTATION_SUMMARY.md) - Full details  

### Step 4: Configure Apache (mod_rewrite)

## Default CredentialsEnsure `.htaccess` file exists in `api/` folder with:

```apache

| Role | Email | Password |RewriteEngine On

|------|-------|----------|RewriteCond %{REQUEST_FILENAME} !-f

| Admin | admin@nba.edu | admin123 |RewriteCond %{REQUEST_FILENAME} !-d

| HOD (CSE) | hod.cse@nba.edu | hod123 |RewriteRule ^(.*)$ index.php [QSA,L]

| Faculty | faculty1.cse@nba.edu | faculty123 |```



⚠️ **Change these in production!**### Step 5: Test Installation

1. Open browser: http://localhost/nba/api/

## Example Workflow2. You should see: `{"message": "NBA Assessment API v1.0"}`

3. If you get 404 or errors, ensure mod_rewrite is enabled in XAMPP

```bash

# 1. Login as faculty### Step 6: Configure CORS (Optional)

curl -X POST http://localhost/nba/api/login \If using different frontend URL, edit `api/middleware/CorsMiddleware.php`:

  -H "Content-Type: application/json" \```php

  -d '{"employeeIdOrEmail":"faculty1.cse@nba.edu","password":"faculty123"}'// Change this line to your frontend URL

header("Access-Control-Allow-Origin: http://your-frontend-url:port");

# 2. Get your courses```

curl -X GET http://localhost/nba/api/courses \

  -H "Authorization: Bearer YOUR_JWT_TOKEN"---



# 3. Create assessment## 📚 API Documentation

curl -X POST http://localhost/nba/api/assessment \

  -H "Authorization: Bearer YOUR_JWT_TOKEN" \### Base URL

  -d '{```

    "course_id": 1,http://localhost/nba/api

    "name": "Mid Semester",```

    "full_marks": 50,

    "questions": [### Authentication

      {"question_number": 1, "co": 1, "max_marks": 10}All endpoints (except auth) require JWT token in header:

    ]```

  }'Authorization: Bearer <your-jwt-token>

```

# 4. Enroll students

curl -X POST http://localhost/nba/api/courses/1/enroll \### API Categories

  -H "Authorization: Bearer YOUR_JWT_TOKEN" \

  -d '{#### 1️⃣ Authentication & Profile (4 endpoints)

    "students": [{"rollno": "CS101", "name": "John Doe"}]- `POST /auth/login` - User login (returns JWT token)

  }'- `POST /auth/register` - Register new user

- `GET /auth/profile` - Get current user profile

# 5. Enter marks- `PUT /auth/profile` - Update user profile

curl -X POST http://localhost/nba/api/marks/bulk \

  -H "Authorization: Bearer YOUR_JWT_TOKEN" \#### 2️⃣ Assessment Management (5 endpoints)

  -d '{- `GET /courses` - List all courses

    "test_id": 1,- `POST /courses` - Create new course

    "marks_entries": [- `GET /courses/{id}` - Get course details

      {"student_rollno": "CS101", "question_number": 1, "marks_obtained": 8.5}- `PUT /courses/{id}` - Update course

    ]- `DELETE /courses/{id}` - Delete course

  }'

```Plus: test and question management endpoints



## Project Structure#### 3️⃣ Marks Management (9 endpoints)

- `POST /marks/by-question` - Save per-question marks (auto-calculates CO)

```- `POST /marks/by-co` - Save CO-aggregated marks directly

nba/- `POST /marks/bulk` - Bulk marks entry for multiple students

├── api/                    # Backend API- `GET /marks` - Get marks for student + test

│   ├── config/            # Database configuration- `GET /marks/test` - Get all students' marks for a test

│   ├── controllers/       # Business logic- `PUT /marks/raw/{id}` - Update individual marks entry

│   ├── middleware/        # Auth, CORS, Validation- `DELETE /marks/raw/{id}` - Delete individual marks entry

│   ├── models/            # Entities and repositories- `DELETE /marks/student/{testId}/{studentId}` - Delete all student marks

│   ├── routes/            # API routes

│   ├── utils/             # JWT, Auth services#### 4️⃣ Question Management (2 endpoints)

│   └── index.php          # Entry point- `PUT /questions/{id}` - Update question CO mapping

├── docs/                  # Complete documentation- `DELETE /questions/{id}` - Delete question

└── frontend/              # Frontend project (separate)

```#### 5️⃣ Student Enrollment (2 endpoints)

- `POST /enrollments/bulk` - Bulk enroll students

---- `GET /enrollments/course/{courseId}` - View enrolled students



**Version**: 1.0 | **Base URL**: `http://localhost/nba/api/` | **Last Updated**: January 2025**Total**: 17+ API endpoints


📖 **Full Documentation**: 
- Complete API reference: `docs/APIDocumentation.md`
- CRUD operations guide: `docs/CRUD_OPERATIONS.md`
- Bulk features: `docs/BULK_MARKS_FEATURE.md` and `docs/ENROLLMENT_FEATURE.md`

---

## 🔑 Default Credentials

### Admin Account
- **Email**: `admin@nba.edu`
- **Password**: `admin123`
- **Role**: admin (full access)

### HOD Account (CSE Department)
- **Email**: `hod.cse@nba.edu`
- **Password**: `hod123`
- **Role**: hod (department head)

### Faculty Account (Sample)
- **Email**: `faculty1.cse@nba.edu`
- **Password**: `faculty123`
- **Role**: faculty (teacher)

⚠️ **Security Note**: Change default passwords in production!

---

## 📊 Database Schema

### Tables Overview

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| **departments** | Academic departments | → users, course, student |
| **users** | All system users (admin/HOD/faculty/staff) | → course (teacher) |
| **course** | Courses with year/semester | → test |
| **test** | Assessments/exams | → question, rawMarks, marks |
| **question** | Test questions with CO mapping | → rawMarks |
| **student** | Student information | → rawMarks, marks |
| **rawMarks** | Per-question marks (temporary) | - |
| **marks** | CO-aggregated marks (permanent) | - |

### Key Constraints
- **Year**: 4-digit calendar year (1000-9999) e.g., 2024, 2025
- **Semester**: Any positive integer (1, 2, 3, ... no upper limit)
- **CO**: Course Outcome 1-6
- **Question Number**: 1-20 per test
- **Marks**: DECIMAL(5,2) - supports up to 999.99 with 2 decimal places

📖 **Detailed Schema**: See `docs/schema.md` for complete ERD and table descriptions

---

## 🎨 Features in Detail

### 1. Flexible Year/Semester System
Unlike traditional systems that restrict year to 1-5:
- **Year**: Store actual calendar year (2024, 2025) for accurate historical tracking
- **Semester**: Support any numbering scheme (1-12, even/odd, or custom)
- **Use Case**: Handle multiple batches, different academic calendars

### 2. Dynamic Test Creation
- Create tests with any number of questions (up to 20)
- Each question has:
  - Question number (1-20)
  - CO mapping (CO1-CO6)
  - Individual max marks
- Test max marks = sum of all question max marks

### 3. Dual Marks Storage System

#### Method 1: Per-Question Entry (Recommended)
```
Faculty enters: Q1=8.5, Q2=9.0 (both CO1), Q3=7.5 (CO2)
System calculates: CO1=17.5, CO2=7.5
Storage: rawMarks (3 records) + marks (1 record with CO totals)
```

**Benefits**:
- ✅ Maintains question-level audit trail
- ✅ Enables detailed analysis (which questions students struggled with)
- ✅ Automatic CO aggregation (no manual calculation)

#### Method 2: Direct CO Entry
```
Faculty enters: CO1=17.5, CO2=7.5, CO3=20.0
System stores: marks (1 record)
```

**Benefits**:
- ✅ Faster for bulk entry
- ✅ Useful when question-level detail not needed
- ✅ Direct control over CO totals

### 4. CO-Based Assessment
- Map each question to one of six Course Outcomes (CO1-CO6)
- Automatic aggregation of marks per CO
- NBA-ready data structure for attainment calculation
- Supports CO-PO mapping and reporting

### 5. Role-Based Access Control
- **Admin**: Full system access, manage all departments
- **HOD**: Department-level access, manage courses and faculty
- **Faculty**: Course-level access, manage own courses and tests
- **Staff**: View-only access for reports

---

## 🧪 Testing with Postman

### Import Collection
1. Open Postman
2. Click **Import** → **Choose File**
3. Select: `docs/postmanAPIScript.json`
4. Collection "NBA Assessment API" will be imported with all 13 endpoints

### Quick Test Flow
1. **Login**:
   - Endpoint: `POST /auth/login`
   - Body: `{"email": "admin@nba.edu", "password": "admin123"}`
   - Copy JWT token from response

2. **Set Token**:
   - Postman collection has `{{jwt_token}}` variable
   - Paste token in collection variables or environment

3. **Create Course**:
   - Endpoint: `POST /courses`
   - Body: Include year (2024) and semester (6)

4. **Create Test**:
   - Endpoint: `POST /tests` (if available)
   - Link to created course

5. **Save Marks**:
   - Endpoint: `POST /marks/by-question`
   - Watch auto-calculation of CO totals

📖 **API Documentation**: See `docs/APIDocumentation.md` for request/response examples

---

## 📁 Project Structure

```
nba/
├── api/                          # Backend API
│   ├── config/
│   │   └── Database.php          # Database connection
│   ├── controllers/
│   │   ├── AuthController.php    # Authentication logic
│   │   ├── CourseController.php  # Course management
│   │   └── MarksController.php   # Marks management
│   ├── middleware/
│   │   ├── AuthMiddleware.php    # JWT verification
│   │   └── CorsMiddleware.php    # CORS headers
│   ├── models/
│   │   ├── Course.php            # Course entity
│   │   ├── CourseRepository.php  # Course database ops
│   │   ├── Student.php           # Student entity
│   │   ├── RawMarks.php          # Per-question marks entity
│   │   ├── Marks.php             # CO-aggregated marks entity
│   │   └── ...                   # Other models
│   ├── routes/
│   │   └── api.php               # API routes definition
│   ├── utils/
│   │   └── JWT.php               # JWT utilities
│   ├── .htaccess                 # Apache rewrite rules
│   └── index.php                 # API entry point
├── docs/
│   ├── db.sql                    # Database schema + sample data
│   ├── schema.md                 # Database documentation
│   ├── APIDocumentation.md       # API reference
│   ├── postmanAPIScript.json     # Postman collection
│   └── requirements.txt          # System requirements
├── frontend/                     # (Separate frontend project)
│   └── hello.txt
└── README.md                     # This file
```

---

## 🔧 Troubleshooting

### Issue: 404 Not Found
**Cause**: mod_rewrite not enabled or .htaccess not working
**Solution**:
1. Edit `C:\xampp\apache\conf\httpd.conf`
2. Find and uncomment: `LoadModule rewrite_module modules/mod_rewrite.so`
3. Change `AllowOverride None` to `AllowOverride All` for htdocs directory
4. Restart Apache

### Issue: CORS Error in Frontend
**Cause**: Frontend URL not allowed in CORS configuration
**Solution**:
1. Edit `api/middleware/CorsMiddleware.php`
2. Change `Access-Control-Allow-Origin` to your frontend URL
3. Or use `*` for development (not recommended for production)

### Issue: Database Connection Failed
**Cause**: Wrong credentials or MySQL not running
**Solution**:
1. Ensure MySQL is running in XAMPP Control Panel
2. Check credentials in `api/config/Database.php`
3. Verify database `nba_db` exists in phpMyAdmin

### Issue: JWT Token Invalid
**Cause**: Token expired or secret key mismatch
**Solution**:
1. Login again to get new token
2. Check `JWT_SECRET` in `api/utils/JWT.php`
3. Ensure token is sent in `Authorization: Bearer <token>` format

### Issue: Year Validation Error
**Cause**: Using old year format (1-5) instead of calendar year
**Solution**:
- Use 4-digit calendar year: 2024, 2025, etc.
- Range: 1000-9999
- See `docs/schema.md` for validation rules

---

## 📖 Additional Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **API Reference** | Complete API endpoints with examples | `docs/APIDocumentation.md` |
| **CRUD Operations** | Update/Delete operations for questions and marks | `docs/CRUD_OPERATIONS.md` |
| **Bulk Marks Feature** | Bulk marks entry documentation | `docs/BULK_MARKS_FEATURE.md` |
| **Enrollment Feature** | Bulk student enrollment guide | `docs/ENROLLMENT_FEATURE.md` |
| **Database Schema** | ERD, table descriptions, relationships | `docs/schema.md` |
| **Postman Collection** | Import-ready API tests | `docs/postmanAPIScript.json` |
| **Requirements** | System requirements | `docs/requirements.txt` |
| **SQL Schema** | Database creation script | `docs/db.sql` |

---

## 🎯 Usage Example

### Complete Workflow: From Login to Marks Entry

#### 1. Login as Faculty
```bash
POST http://localhost/nba/api/auth/login
Content-Type: application/json

{
  "email": "faculty1.cse@nba.edu",
  "password": "faculty123"
}

Response:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "user": {
    "id": 7,
    "name": "Dr. Rajesh Kumar",
    "role": "faculty"
  }
}
```

#### 2. Get Your Courses
```bash
GET http://localhost/nba/api/courses
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGci...

Response:
{
  "data": [
    {
      "id": 1,
      "course_code": "CS101",
      "course_name": "Data Structures",
      "year": 2024,
      "semester": 3
    }
  ]
}
```

#### 3. Create Test for Course
```bash
POST http://localhost/nba/api/tests
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGci...
Content-Type: application/json

{
  "course_id": 1,
  "test_name": "CAT 1",
  "max_marks": 50
}
```

#### 4. Add Questions to Test
```bash
POST http://localhost/nba/api/questions
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGci...
Content-Type: application/json

{
  "test_id": 1,
  "questions": [
    {"question_number": 1, "co": 1, "max_marks": 10},
    {"question_number": 2, "co": 1, "max_marks": 10},
    {"question_number": 3, "co": 2, "max_marks": 15},
    {"question_number": 4, "co": 3, "max_marks": 15}
  ]
}
```

#### 5. Enter Marks for Student
```bash
POST http://localhost/nba/api/marks/by-question
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGci...
Content-Type: application/json

{
  "test_id": 1,
  "student_id": 1,
  "marks": [
    {"question_id": 1, "marks": 8.5},
    {"question_id": 2, "marks": 9.0},
    {"question_id": 3, "marks": 12.5},
    {"question_id": 4, "marks": 13.0}
  ]
}

Response:
{
  "success": true,
  "message": "Marks saved successfully",
  "co_totals": {
    "CO1": 17.5,
    "CO2": 12.5,
    "CO3": 13.0
  }
}
```

---

## 🚀 Future Enhancements

- [ ] Frontend UI (React/Vue)
- [ ] PDF report generation
- [ ] Bulk marks upload (CSV/Excel)
- [ ] CO-PO mapping and attainment calculation
- [ ] Email notifications
- [ ] Audit logs for all operations
- [ ] Data backup and restore
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 📝 Development Notes

### Code Standards
- **PHP**: PSR-12 coding standard
- **Architecture**: MVC with SOLID principles
- **Security**: Prepared statements (no SQL injection)
- **Validation**: Server-side validation for all inputs
- **Error Handling**: Try-catch blocks with meaningful messages

### Best Practices Implemented
- ✅ Separation of Concerns (Models, Controllers, Repositories)
- ✅ Dependency Injection (Database, Repositories)
- ✅ Single Responsibility Principle (each class has one job)
- ✅ DRY (Don't Repeat Yourself) - reusable components
- ✅ Consistent API responses (success/error format)
- ✅ Security headers (CORS, Content-Type)

### Database Design Decisions
- **No Timestamps**: Removed created_at/updated_at to reduce clutter
- **Calendar Year**: Year field stores actual year (2024) not academic year (1-5)
- **Flexible Semester**: No upper limit on semester number
- **Dual Marks Storage**: Maintains both detail (rawMarks) and summary (marks)
- **Cascade Deletes**: Automatic cleanup of child records

---

## 🤝 Contributing

This is an educational project. Contributions are welcome!

### How to Contribute
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is created for educational purposes.

---

## 👨‍💻 Author

Developed as part of NBA accreditation requirements for educational institutions.

---

## 🙏 Acknowledgments

- Built with PHP, MySQL, and dedication
- Designed for Indian engineering colleges following NBA guidelines
- Thanks to all educators working on outcome-based education

---

## 📞 Support

For issues, questions, or suggestions:
1. Check `docs/APIDocumentation.md` for API details
2. Check `docs/schema.md` for database structure
3. Review this README for setup and usage
4. Check Troubleshooting section above

---

**Happy Coding! 🚀**

---

## Quick Links

- 📖 [API Documentation](docs/APIDocumentation.md)
- � [CRUD Operations Guide](docs/CRUD_OPERATIONS.md)
- 📦 [Bulk Marks Feature](docs/BULK_MARKS_FEATURE.md)
- 👥 [Enrollment Feature](docs/ENROLLMENT_FEATURE.md)
- �🗄️ [Database Schema](docs/schema.md)
- 🧪 [Postman Collection](docs/postmanAPIScript.json)
- 📋 [Requirements](docs/requirements.txt)
- 💾 [SQL Schema](docs/db.sql)
