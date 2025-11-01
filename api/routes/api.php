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
require_once __DIR__ . '/../models/Course.php';
require_once __DIR__ . '/../models/CourseRepository.php';
require_once __DIR__ . '/../models/Test.php';
require_once __DIR__ . '/../models/TestRepository.php';
require_once __DIR__ . '/../models/Question.php';
require_once __DIR__ . '/../models/QuestionRepository.php';
require_once __DIR__ . '/../models/Student.php';
require_once __DIR__ . '/../models/StudentRepository.php';
require_once __DIR__ . '/../models/RawMarks.php';
require_once __DIR__ . '/../models/RawMarksRepository.php';
require_once __DIR__ . '/../models/Marks.php';
require_once __DIR__ . '/../models/MarksRepository.php';
require_once __DIR__ . '/../utils/JWTService.php';
require_once __DIR__ . '/../utils/AuthService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/ValidationMiddleware.php';
require_once __DIR__ . '/../middleware/CorsMiddleware.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/AssessmentController.php';
require_once __DIR__ . '/../controllers/MarksController.php';

/**
 * Router Class
 * Handles HTTP request routing
 */
class Router
{
    private $corsMiddleware;
    private $authMiddleware;
    private $userController;
    private $assessmentController;
    private $marksController;

    public function __construct()
    {
        // Initialize database connection
        $dbConfig = new DatabaseConfig();
        $db = $dbConfig->getConnection();

        // Initialize repositories and services
        $userRepository = new UserRepository($db);
        $departmentRepository = new DepartmentRepository($db);
        $courseRepository = new CourseRepository($db);
        $testRepository = new TestRepository($db);
        $questionRepository = new QuestionRepository($db);
        $studentRepository = new StudentRepository($db);
        $rawMarksRepository = new RawMarksRepository($db);
        $marksRepository = new MarksRepository($db);
        $jwtService = new JWTService();
        $authService = new AuthService($userRepository, $jwtService, $departmentRepository);

        // Initialize middleware
        $this->corsMiddleware = new CorsMiddleware();
        $this->authMiddleware = new AuthMiddleware($authService);

        // Initialize validation middleware
        $validationMiddleware = new ValidationMiddleware();

        // Initialize controllers
        $this->userController = new UserController($authService, $userRepository, $departmentRepository, $validationMiddleware);
        $this->assessmentController = new AssessmentController($courseRepository, $testRepository, $questionRepository, $validationMiddleware);
        $this->marksController = new MarksController($studentRepository, $rawMarksRepository, $marksRepository, $questionRepository, $testRepository, $validationMiddleware);
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
            case '':
            case '/':
                // Root endpoint - API info
                $this->sendWelcome();
                break;

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

            case 'courses':
                if ($method === 'GET') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->assessmentController->getFacultyCourses();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            case 'assessment':
                if ($method === 'POST') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->assessmentController->createAssessment();
                } elseif ($method === 'GET') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->assessmentController->getAssessment();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            case 'course-tests':
                if ($method === 'GET') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->assessmentController->getCourseTests();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            case 'marks/by-question':
                if ($method === 'POST') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->marksController->saveMarksByQuestion();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            case 'marks/by-co':
                if ($method === 'POST') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->marksController->saveMarksByCO();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            case 'marks':
                if ($method === 'GET') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->marksController->getMarks();
                } else {
                    $this->sendMethodNotAllowed();
                }
                break;

            case 'marks/test':
                if ($method === 'GET') {
                    $user = $this->authMiddleware->requireAuth();
                    $_REQUEST['authenticated_user'] = $user;
                    $this->marksController->getTestMarks();
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
     * Send welcome message for root endpoint
     */
    private function sendWelcome()
    {
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'NBA Assessment API v1.0',
            'version' => '1.0.0',
            'documentation' => '/nba/docs/APIDocumentation.md',
            'endpoints' => [
                'auth' => [
                    'POST /auth/login',
                    'GET /auth/profile',
                    'PUT /auth/profile',
                    'POST /auth/logout'
                ],
                'courses' => [
                    'GET /courses'
                ],
                'assessment' => [
                    'POST /assessment',
                    'GET /assessment',
                    'GET /course-tests'
                ],
                'marks' => [
                    'POST /marks/by-question',
                    'POST /marks/by-co',
                    'GET /marks',
                    'GET /marks/test'
                ]
            ]
        ]);
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
