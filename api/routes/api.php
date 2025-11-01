<?php

/**
 * API Routes Configuration
 * Follows Single Responsibility Principle - handles only routing
 */

// Include all necessary classes
require_once __DIR__ . '/../config/DatabaseConfig.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/UserRepository.php';
require_once __DIR__ . '/../models/Department.php';
require_once __DIR__ . '/../models/DepartmentRepository.php';
require_once __DIR__ . '/../utils/JWTService.php';
require_once __DIR__ . '/../utils/AuthService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/ValidationMiddleware.php';
require_once __DIR__ . '/../middleware/CorsMiddleware.php';
require_once __DIR__ . '/../controllers/UserController.php';

/**
 * Router Class
 * Handles HTTP request routing
 */
class Router
{
    private $corsMiddleware;
    private $authMiddleware;
    private $userController;

    public function __construct()
    {
        // Initialize database connection
        $dbConfig = new DatabaseConfig();
        $db = $dbConfig->getConnection();

        // Initialize repositories and services
        $userRepository = new UserRepository($db);
        $departmentRepository = new DepartmentRepository($db);
        $jwtService = new JWTService();
        $authService = new AuthService($userRepository, $jwtService, $departmentRepository);

        // Initialize middleware
        $this->corsMiddleware = new CorsMiddleware();
        $this->authMiddleware = new AuthMiddleware($authService);

        // Initialize validation middleware
        $validationMiddleware = new ValidationMiddleware();

        // Initialize controllers
        $this->userController = new UserController($authService, $userRepository, $departmentRepository, $validationMiddleware);
    }

    /**
     * Handle incoming request
     */
    public function handleRequest()
    {
        // Set CORS headers for all requests
        $this->corsMiddleware->setCorsHeaders();

        // Handle preflight requests
        $this->corsMiddleware->handlePreflight();

        // Get request method and path
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Remove base path (/nba/api/)
        $basePath = '/nba/api/';
        if (strpos($path, $basePath) === 0) {
            $path = substr($path, strlen($basePath));
        }

        // Route requests
        switch ($path) {
            case 'login':
                if ($method === 'POST') {
                    $this->userController->login();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            case 'profile':
                if ($method === 'GET') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->userController->getProfile();
                } elseif ($method === 'PUT') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->userController->updateProfile();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            case 'logout':
                if ($method === 'POST') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $_REQUEST['token'] = $this->authMiddleware->getTokenFromHeader();
                    $this->userController->logout();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            case 'department':
                if ($method === 'GET') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->userController->getDepartmentByEmployeeId();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            default:
                $this->sendNotFound();
                break;
        }
    }

    /**
     * Send 404 Not Found response
     */
    private function sendNotFound()
    {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found'
        ]);
    }

    /**
     * Send 405 Method Not Allowed response
     */
    private function sendMethodNotAllowed()
    {
        http_response_code(405);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
    }
}

// Initialize and handle request
$router = new Router();
$router->handleRequest();
