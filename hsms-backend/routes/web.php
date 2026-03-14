<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Create assignments tables
Route::get('/setup-assignments', function () {
    try {
        DB::statement("CREATE TABLE IF NOT EXISTS assignments (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            subject_id BIGINT UNSIGNED NOT NULL,
            class_id BIGINT UNSIGNED NOT NULL,
            teacher_id BIGINT UNSIGNED NOT NULL,
            due_date DATETIME NOT NULL,
            total_marks INT NOT NULL DEFAULT 100,
            attachment_url VARCHAR(255) NULL,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
            FOREIGN KEY (class_id) REFERENCES class_rooms(id) ON DELETE CASCADE,
            FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        
        DB::statement("CREATE TABLE IF NOT EXISTS assignment_submissions (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            assignment_id BIGINT UNSIGNED NOT NULL,
            student_id BIGINT UNSIGNED NOT NULL,
            submission_text TEXT NULL,
            attachment_url VARCHAR(255) NULL,
            submitted_at DATETIME NULL,
            marks_obtained INT NULL,
            feedback TEXT NULL,
            graded_at DATETIME NULL,
            status ENUM('pending', 'submitted', 'late', 'graded') NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL,
            FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        
        return '<h1>✅ Success!</h1><p>Assignments tables created successfully!</p>';
    } catch (\Exception $e) {
        return '<h1>❌ Error</h1><p>' . $e->getMessage() . '</p>';
    }
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
