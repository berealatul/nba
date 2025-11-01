<?php

/**
 * Database Setup Script - FIXED for XAMPP Windows
 * Place in: htdocs/nba/setup.php
 * Run: http://localhost/nba/setup.php
 */

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'nba_db';

try {
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$database`");

    // Departments table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `departments` (
            `department_id` INT(11) NOT NULL AUTO_INCREMENT,
            `department_name` VARCHAR(100) NOT NULL UNIQUE,
            `department_code` VARCHAR(10) NOT NULL UNIQUE,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`department_id`),
            INDEX `idx_department_code` (`department_code`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Users table - FIXED: email/username <= 64 chars
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `users` (
            `employee_id` INT(11) NOT NULL,
            `username` VARCHAR(64) NOT NULL,
            `email` VARCHAR(64) NOT NULL UNIQUE,
            `password` VARCHAR(255) NOT NULL,
            `role` ENUM('admin', 'dean', 'hod', 'faculty', 'staff') NOT NULL,
            `department_id` INT(11) NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`employee_id`),
            INDEX `idx_email` (`email`),
            INDEX `idx_role` (`role`),
            INDEX `idx_department_id` (`department_id`),
            FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Insert sample departments
    $sampleDepartments = [
        ['Computer Science', 'CS'],
        ['Information Technology', 'IT'],
        ['Mechanical Engineering', 'ME'],
        ['Electrical Engineering', 'EE'],
        ['Administration', 'ADMIN']
    ];

    $checkDept = $pdo->prepare("SELECT 1 FROM departments WHERE department_code = ?");
    $insertDept = $pdo->prepare("INSERT INTO departments (department_name, department_code) VALUES (?, ?)");

    foreach ($sampleDepartments as $d) {
        $checkDept->execute([$d[1]]);
        if (!$checkDept->fetch()) {
            $insertDept->execute([$d[0], $d[1]]);
        }
    }

    // Insert sample users
    $sampleUsers = [
        [1001, 'System Admin', 'admin@nba.edu', password_hash('admin123', PASSWORD_DEFAULT), 'admin', null],
        [2001, 'John Doe', 'john.doe@nba.edu', password_hash('password123', PASSWORD_DEFAULT), 'faculty', 1],
        [3001, 'Jane Doe', 'jane.doe@nba.edu', password_hash('password123', PASSWORD_DEFAULT), 'staff', 5],
        [4001, 'Bob Smith', 'bob.smith@nba.edu', password_hash('password123', PASSWORD_DEFAULT), 'hod', 2],
    ];

    $checkUser = $pdo->prepare("SELECT 1 FROM users WHERE employee_id = ?");
    $insertUser = $pdo->prepare("INSERT INTO users (employee_id, username, email, password, role, department_id) VALUES (?, ?, ?, ?, ?, ?)");

    foreach ($sampleUsers as $u) {
        $checkUser->execute([$u[0]]);
        if (!$checkUser->fetch()) {
            $insertUser->execute($u);
        }
    }

    echo "<pre>Database setup completed successfully!\n";
    echo "URL: http://localhost/nba/setup.php\n";
    echo "\nTest Logins:\n";
    echo "Admin     → 1001 or admin@nba.edu    / admin123\n";
    echo "Faculty   → 2001 or john.doe@nba.edu / password123\n";
    echo "Staff     → 3001 or jane.doe@nba.edu / password123\n";
    echo "HOD       → 4001 or bob.smith@nba.edu/ password123\n";
    echo "</pre>";
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
