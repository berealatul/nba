-- =============================================
-- NBA PROJECT: FULL DATABASE (ENGINEERING ONLY)
-- Database: nba_db
-- Scope: School of Engineering
-- =============================================
-- Drop and recreate database
DROP DATABASE IF EXISTS `nba_db`;
CREATE DATABASE `nba_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nba_db`;
-- =============================================
-- TABLE: departments (Only Engineering)
-- =============================================
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
    `department_id` INT(11) NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(100) NOT NULL,
    `department_code` VARCHAR(10) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`department_id`),
    UNIQUE KEY `uq_dept_name` (`department_name`),
    UNIQUE KEY `uq_dept_code` (`department_code`),
    INDEX `idx_dept_code` (`department_code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =============================================
-- TABLE: users
-- =============================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `employee_id` INT(11) NOT NULL,
    `username` VARCHAR(64) NOT NULL,
    `email` VARCHAR(64) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'dean', 'hod', 'faculty', 'staff') NOT NULL,
    `department_id` INT(11) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`employee_id`),
    UNIQUE KEY `uq_email` (`email`),
    INDEX `idx_role` (`role`),
    INDEX `idx_dept` (`department_id`),
    CONSTRAINT `fk_user_dept` FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE
    SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =============================================
-- INSERT: Engineering Departments Only
-- =============================================
INSERT INTO `departments` (`department_name`, `department_code`)
VALUES ('Computer Science & Engineering', 'CSE'),
    ('Electronics & Communication Engineering', 'ECE'),
    ('Electrical Engineering', 'EE'),
    ('Mechanical Engineering', 'ME'),
    ('Civil Engineering', 'CE'),
    ('Food Engineering & Technology', 'FET'),
    ('Energy', 'ENE');
-- =============================================
-- INSERT: Users
-- 1. Admin (admin123)
-- 2. HODs (password123)
-- 3. Faculty (password123)
-- 4. Staff (password123)
-- =============================================
-- ADMIN
INSERT INTO `users` (
        `employee_id`,
        `username`,
        `email`,
        `password`,
        `role`,
        `department_id`
    )
VALUES (
        1001,
        'System Administrator',
        'admin@tezu.edu',
        '$2y$10$tnWpFNPhCWgg5y7.HTB7LeiMchFNnxp783V3dD8ZVOzsd5didUlqG',
        'admin',
        NULL
    );
-- HODs (Real HODs with exact email)
INSERT INTO `users` (
        `employee_id`,
        `username`,
        `email`,
        `password`,
        `role`,
        `department_id`
    )
VALUES (
        2001,
        'Prof. Kamal Uddin Ahmed',
        'kamal@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'hod',
        1
    ),
    -- CSE
    (
        2002,
        'Prof. Santanu Sharma',
        'santanu@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'hod',
        2
    ),
    -- ECE
    (
        2003,
        'Prof. Partha Pratim Dutta',
        'partha@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'hod',
        4
    ),
    -- ME
    (
        2004,
        'Prof. Karobi Saikia',
        'karobi@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'hod',
        5
    ),
    -- CE
    (
        2005,
        'Prof. Madhumita Barbora',
        'madhu@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'hod',
        6
    );
-- FET
-- FACULTY (Real names & emails from Engineering depts)
INSERT INTO `users` (
        `employee_id`,
        `username`,
        `email`,
        `password`,
        `role`,
        `department_id`
    )
VALUES -- CSE
    (
        3001,
        'Dr. Nityananda Sarma',
        'nityananda@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        1
    ),
    (
        3002,
        'Dr. Shobhan Kumar Majumder',
        'skm@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        1
    ),
    (
        3003,
        'Dr. Rosy Sarmah',
        'rosy8@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        1
    ),
    (
        3004,
        'Dr. Sanjib Kumar Deka',
        'sdeka@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        1
    ),
    -- ECE
    (
        3005,
        'Dr. Bhabesh Deka',
        'bhabesh@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        2
    ),
    (
        3006,
        'Dr. Soumik Roy',
        'soumik@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        2
    ),
    -- MECHANICAL
    (
        3007,
        'Dr. Tapan Kumar Gogoi',
        'tgogoi@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        4
    ),
    (
        3008,
        'Dr. Dilip Datta',
        'ddatta@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        4
    ),
    (
        3009,
        'Dr. Polash Pratim Dutta',
        'polash@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        4
    ),
    -- CIVIL
    (
        3010,
        'Dr. Manash Jyoti Dutta',
        'manash@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        5
    ),
    (
        3011,
        'Dr. Ankurjyoti Saikia',
        'ankur@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        5
    ),
    -- FET
    (
        3012,
        'Dr. Charu Lata Mahanta',
        'charu@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        6
    ),
    (
        3013,
        'Dr. Laxmikant S. Badwaik',
        'laxmikant@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        6
    ),
    -- ENERGY
    (
        3014,
        'Dr. Rupam Kataki',
        'rupam@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        7
    ),
    (
        3015,
        'Dr. Debendra Chandra Baruah',
        'dcbaruah@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'faculty',
        7
    );
-- STAFF (Administration/Technical)
INSERT INTO `users` (
        `employee_id`,
        `username`,
        `email`,
        `password`,
        `role`,
        `department_id`
    )
VALUES (
        4001,
        'Mr. Biren Das',
        'biren@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'staff',
        NULL
    ),
    (
        4002,
        'Ms. Anjali Borah',
        'anjali@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'staff',
        NULL
    ),
    (
        4003,
        'Mr. Rajesh Saikia',
        'rajesh@tezu.ernet.in',
        '$2y$10$nlejuSHfBoAun490JDUHCuB4ZudU/4YR7eSh0OGuCV50poRy1NGUe',
        'staff',
        NULL
    );