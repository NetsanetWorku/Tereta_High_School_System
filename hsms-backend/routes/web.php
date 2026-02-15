<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'running',
        'message' => 'High School Management System API',
        'version' => app()->version(),
        'timestamp' => now()->toDateTimeString(),
        'endpoints' => [
            'api' => url('/api'),
            'documentation' => 'API endpoints available at /api/*'
        ]
    ]);
});

// Test route to view last email from log
Route::get('/test-email', function () {
    $logPath = storage_path('logs/laravel.log');
    
    if (!file_exists($logPath)) {
        return 'No log file found';
    }
    
    $logContent = file_get_contents($logPath);
    
    // Extract the last email HTML
    preg_match_all('/Content-Type: text\/html.*?<html>(.*?)<\/html>/s', $logContent, $matches);
    
    if (empty($matches[1])) {
        return 'No emails found in log';
    }
    
    // Return the last email
    $lastEmail = end($matches[0]);
    
    // Extract just the HTML part
    preg_match('/<html>(.*?)<\/html>/s', $lastEmail, $htmlMatch);
    
    if (empty($htmlMatch[0])) {
        return 'Could not extract email HTML';
    }
    
    return response($htmlMatch[0])->header('Content-Type', 'text/html');
});
