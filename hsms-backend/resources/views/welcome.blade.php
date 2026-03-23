<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tereta High School Management System - API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            font-size: 1.1em;
        }
        .status-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            margin: 20px 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .info-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .info-card h3 {
            color: #667eea;
            font-size: 0.9em;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .info-card p {
            color: #333;
            font-size: 1.2em;
            font-weight: bold;
        }
        .endpoints {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .endpoints h2 {
            color: #667eea;
            margin-bottom: 15px;
        }
        .endpoint-item {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 3px solid #10b981;
        }
        .endpoint-item code {
            color: #e83e8c;
            background: #f8f9fa;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            color: #666;
        }
        .pulse {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Tereta High School Management System</h1>
            <p>Backend API Server</p>
            <div class="status-badge pulse">● Server Running</div>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <h3>Laravel Version</h3>
                <p>{{ app()->version() }}</p>
            </div>
            <div class="info-card">
                <h3>PHP Version</h3>
                <p>{{ PHP_VERSION }}</p>
            </div>
            <div class="info-card">
                <h3>Environment</h3>
                <p>{{ config('app.env') }}</p>
            </div>
            <div class="info-card">
                <h3>Server Time</h3>
                <p>{{ now()->format('H:i:s') }}</p>
            </div>
        </div>

        <div class="endpoints">
            <h2>📡 Available API Endpoints</h2>
            
            <div class="endpoint-item">
                <strong>Authentication</strong><br>
                <code>POST /api/register</code> - Register new user<br>
                <code>POST /api/login</code> - User login<br>
                <code>POST /api/logout</code> - User logout
            </div>

            <div class="endpoint-item">
                <strong>Student</strong><br>
                <code>GET /api/my-timetable</code> - Get student timetable<br>
                <code>GET /api/my-assignments</code> - Get student assignments<br>
                <code>GET /api/my-exam-schedules</code> - Get student exams
            </div>

            <div class="endpoint-item">
                <strong>Teacher</strong><br>
                <code>GET /api/teacher/my-timetable</code> - Get teacher timetable<br>
                <code>GET /api/teacher/my-assignments</code> - Get teacher assignments<br>
                <code>GET /api/teacher/my-exam-schedules</code> - Get teacher exams
            </div>

            <div class="endpoint-item">
                <strong>Admin</strong><br>
                <code>GET /api/students</code> - Manage students<br>
                <code>GET /api/teachers</code> - Manage teachers<br>
                <code>GET /api/classes</code> - Manage classes<br>
                <code>GET /api/timetables</code> - Manage timetables
            </div>

            <div class="endpoint-item">
                <strong>Messaging</strong><br>
                <code>GET /api/conversations</code> - Get conversations<br>
                <code>POST /api/conversations</code> - Start conversation<br>
                <code>POST /api/conversations/{id}/messages</code> - Recieve message
            </div>
        </div>

        <div class="footer">
            <p>🚀 API Base URL: <strong>{{ url('/api') }}</strong></p>
            <p style="margin-top: 10px; font-size: 0.9em;">
                All endpoints require authentication for security!
            </p>
        </div>
    </div>
</body>
</html>
