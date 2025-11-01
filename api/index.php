<?php

/**
 * NBA API Entry Point
 * Main entry point for the NBA API following RESTful principles
 */

// Enable error reporting for development (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Load CORS middleware and set headers FIRST (before any output)
require_once __DIR__ . '/middleware/CorsMiddleware.php';
$corsMiddleware = new CorsMiddleware();
$corsMiddleware->setCorsHeaders();
$corsMiddleware->handlePreflight();

// Set headers for JSON API
header('Content-Type: application/json');

// Include the main router
require_once __DIR__ . '/routes/api.php';
