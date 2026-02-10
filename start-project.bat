@echo off
echo ===============================
echo Starting HSMS Project
echo ===============================

REM Start Laravel Backend
echo Starting Backend...
start cmd /k "D: && cd D:\xampp\htdocs\High_School_Management\hsms-backend && php artisan serve"

REM Start Frontend
echo Starting Frontend...
start cmd /k "D: && cd D:\xampp\htdocs\High_School_Management\hsms-frontend && npm run dev"

echo ===============================
echo Backend and Frontend are running
echo ===============================
