<?php

/**
 * NBA API Entry Point
 * Main entry point for the NBA API following RESTful principles
 */

// Enable error reporting for development (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers for JSON API
header('Content-Type: application/json');

// Include the main router
require_once __DIR__ . '/routes/api.php';
