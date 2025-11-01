<?php

/**
 * Authentication Service
 * Follows Single Responsibility Principle - handles only authentication logic
 * Follows Dependency Inversion Principle - depends on abstractions
 */
class AuthService
{
    private $userRepository;
    private $jwtService;
    private $departmentRepository;

    public function __construct(UserRepository $userRepository, JWTService $jwtService, DepartmentRepository $departmentRepository = null)
    {
        $this->userRepository = $userRepository;
        $this->jwtService = $jwtService;
        $this->departmentRepository = $departmentRepository;
    }

    /**
     * Authenticate user with employee ID/email and password
     * @param string $employeeIdOrEmail
     * @param string $password
     * @return array|null Token and user data or null if authentication fails
     */
    public function authenticate($employeeIdOrEmail, $password)
    {
        // Find user by employee ID or email
        $user = $this->userRepository->findByEmployeeIdOrEmail($employeeIdOrEmail);

        if (!$user) {
            return null; // User not found
        }

        // Verify password
        if (!password_verify($password, $user->getPassword())) {
            return null; // Invalid password
        }

        // Generate token
        $token = $this->jwtService->generateToken($user);

        // Prepare user data with department info
        $userData = $user->toArray();

        // Add department name if user has a department and repository is available
        if ($this->departmentRepository && $user->getDepartmentId()) {
            $department = $this->departmentRepository->findById($user->getDepartmentId());
            if ($department) {
                $userData['department_name'] = $department->getDepartmentName();
                $userData['department_code'] = $department->getDepartmentCode();
            }
        }

        return [
            'token' => $token,
            'user' => $userData
        ];
    }

    /**
     * Validate authentication token
     * @param string $token
     * @return array|null User data or null if invalid
     */
    public function validateToken($token)
    {
        return $this->jwtService->getUserFromToken($token);
    }

    /**
     * Logout user (client-side token removal, server-side could implement token blacklisting)
     * @param string $token
     * @return bool
     */
    public function logout($token)
    {
        // In a more advanced implementation, you might add the token to a blacklist
        // For now, we just validate that the token exists
        return $this->validateToken($token) !== null;
    }
}
