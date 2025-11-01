<?php

/**
 * User Model Class
 * Follows Single Responsibility Principle - handles only user data operations
 * Follows Open/Closed Principle - can be extended without modification
 */
class User
{
    private $employeeId;
    private $username;
    private $email;
    private $password;
    private $role;
    private $departmentId;

    // Valid roles
    const ROLES = ['admin', 'dean', 'hod', 'faculty', 'staff'];

    public function __construct($employeeId, $username = null, $email = null, $password = null, $role = null, $departmentId = null)
    {
        $this->employeeId = $employeeId;
        $this->username = $username;
        $this->email = $email;
        $this->password = $password;
        $this->role = $role;
        $this->departmentId = $departmentId;
    }

    // Getters
    public function getEmployeeId()
    {
        return $this->employeeId;
    }
    public function getUsername()
    {
        return $this->username;
    }
    public function getEmail()
    {
        return $this->email;
    }
    public function getPassword()
    {
        return $this->password;
    }
    public function getRole()
    {
        return $this->role;
    }
    public function getDepartmentId()
    {
        return $this->departmentId;
    }

    // Setters with validation
    public function setEmployeeId($employeeId)
    {
        if (!is_numeric($employeeId) || $employeeId <= 0) {
            throw new InvalidArgumentException("Employee ID must be a positive number");
        }
        $this->employeeId = $employeeId;
    }

    public function setUsername($username)
    {
        if (empty($username) || strlen($username) < 2) {
            throw new InvalidArgumentException("Full name must be at least 2 characters long");
        }
        $this->username = $username;
    }

    public function setEmail($email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format");
        }
        $this->email = $email;
    }

    public function setPassword($password)
    {
        if (strlen($password) < 6) {
            throw new InvalidArgumentException("Password must be at least 6 characters long");
        }
        $this->password = $password;
    }

    public function setRole($role)
    {
        if (!in_array($role, self::ROLES)) {
            throw new InvalidArgumentException("Invalid role. Must be one of: " . implode(', ', self::ROLES));
        }
        $this->role = $role;
    }

    public function setDepartmentId($departmentId)
    {
        if ($departmentId !== null && (!is_numeric($departmentId) || $departmentId <= 0)) {
            throw new InvalidArgumentException("Department ID must be a positive number or null");
        }
        $this->departmentId = $departmentId;
    }

    /**
     * Convert user object to array (for JSON responses)
     * @return array
     */
    public function toArray()
    {
        return [
            'employee_id' => $this->employeeId,
            'username' => $this->username,
            'email' => $this->email,
            'role' => $this->role,
            'department_id' => $this->departmentId
        ];
    }

    /**
     * Validate user data
     * @return array Array of validation errors, empty if valid
     */
    public function validate()
    {
        $errors = [];

        if (empty($this->employeeId) || !is_numeric($this->employeeId) || $this->employeeId <= 0) {
            $errors[] = "Employee ID is required and must be a positive number";
        }

        if (empty($this->username)) {
            $errors[] = "Full name is required";
        } elseif (strlen($this->username) < 2) {
            $errors[] = "Full name must be at least 2 characters long";
        }

        if (empty($this->email)) {
            $errors[] = "Email is required";
        } elseif (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Invalid email format";
        }

        if (empty($this->password)) {
            $errors[] = "Password is required";
        } elseif (strlen($this->password) < 6) {
            $errors[] = "Password must be at least 6 characters long";
        }

        if (empty($this->role)) {
            $errors[] = "Role is required";
        } elseif (!in_array($this->role, self::ROLES)) {
            $errors[] = "Invalid role";
        }

        return $errors;
    }
}
