<?php

/**
 * CORS Middleware
 * Follows Single Responsibility Principle - handles only CORS headers
 */
class CorsMiddleware
{

    /**
     * Handle CORS preflight request
     */
    public function handlePreflight()
    {
        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            $this->setCorsHeaders();
            http_response_code(200);
            exit;
        }
    }

    /**
     * Set CORS headers for all responses
     */
    public function setCorsHeaders()
    {
        // Allow from any origin (adjust for production)
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400'); // 24 hours
    }
}
