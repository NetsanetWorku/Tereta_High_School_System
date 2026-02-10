# School Name Configuration Guide

## School Name: Tereta High School Management System

This document lists all locations where the school name "Tereta High School" is configured throughout the system.

---

## Frontend Configuration

### 1. Login Page
**File:** `hsms-frontend/src/app/login/page.jsx`
- **Line 72:** Main title displays "Tereta High School Management System"
```jsx
<h2 className="mt-6 text-center text-4xl font-extrabold text-white drop-shadow-lg">
  Tereta High School Management System
</h2>
```

### 2. Homepage
**File:** `hsms-frontend/src/app/page.jsx`
- **Line 42:** Main heading displays "Tereta High School Management System"
```jsx
<h1 className="mt-6 justify-center text-4xl font-extrabold text-blue-900">
  Tereta High School Management System
</h1>
```

### 3. Header Component
**File:** `hsms-frontend/src/components/layout/Header.jsx`
- **Line 20:** Header title displays "Tereta High School Management System"
```jsx
<h1 className="text-xl font-bold text-blue-700">
  Tereta High School Management System
</h1>
```

### 4. Sidebar Component
**File:** `hsms-frontend/src/components/layout/Sidebar.jsx`
- **Line 73:** Sidebar logo displays "THSMS" (Tereta High School Management System)
```jsx
<h1 className="text-xl font-bold text-white">THSMS</h1>
```

### 5. Navbar Component
**File:** `hsms-frontend/src/components/layout/Navbar.jsx`
- **Line 14:** Brand name displays "Tereta High School"
```jsx
<div className="text-white font-bold text-xl">
  Tereta High School
</div>
```

### 6. About Page
**File:** `hsms-frontend/src/app/about/page.jsx`
- **Line 11:** Page title displays "About Tereta High School"
- **Line 18:** Mission section mentions "Tereta High School"

### 7. Contact Page
**File:** `hsms-frontend/src/app/contact/page.jsx`
- **Line 22:** Address section displays "Tereta High School"
- **Line 56:** Email addresses use "teretahighschool.edu" domain
- **Line 68:** Website displays "www.teretahighschool.edu"

---

## Backend Configuration

### 8. Environment Variables
**File:** `hsms-backend/.env`
- **Line 67:** Email sender name
```env
MAIL_FROM_NAME="Tereta High School Management System"
```
- **Line 66:** Email sender address
```env
MAIL_FROM_ADDRESS="noreply@teretahs.edu"
```

### 9. Registration Email Notification
**File:** `hsms-backend/app/Notifications/RegistrationSuccess.php`
- **Line 37:** Email subject line
```php
->subject('Welcome to Tereta High School Management System!')
```

### 10. Registration SMS Notification
**File:** `hsms-backend/app/Notifications/RegistrationSMS.php`
- **Line 37:** SMS message content
```php
$message = "Welcome to Tereta High School! Your registration was successful.";
```

---

## Quick Reference

### Abbreviations Used:
- **THSMS** - Tereta High School Management System (used in sidebar)
- **Full Name** - Tereta High School Management System (used in headers, titles, emails)
- **Short Name** - Tereta High School (used in navbar, about page)

### Email Domain:
- Primary: `teretahighschool.edu`
- System emails: `noreply@teretahs.edu`

### Website:
- `www.teretahighschool.edu`

---

## How to Change School Name in Future

If you need to change the school name in the future, update these 10 locations:

1. Login page title
2. Homepage title
3. Header component
4. Sidebar logo
5. Navbar brand
6. About page content
7. Contact page content
8. Backend .env file (MAIL_FROM_NAME and MAIL_FROM_ADDRESS)
9. Email notification subject
10. SMS notification message

---

## Notes

- All user-facing text now displays "Tereta High School Management System"
- Email notifications include the school name
- SMS notifications include the school name
- The system is fully branded with the Tereta High School identity
- Contact information uses teretahighschool.edu domain

Last Updated: February 9, 2026
