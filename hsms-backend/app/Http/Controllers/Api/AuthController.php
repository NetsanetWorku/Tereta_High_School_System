<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\RegistrationSuccess;
use App\Notifications\RegistrationSMS;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class AuthController extends Controller
{
    // 🔹 REGISTER (Public registration)
    // POST /api/register
    public function register(Request $request)
    {
        // Base validation rules
        $rules = [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'phone'    => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|in:student,teacher,parent'
        ];

        // Add role-specific validation rules
        switch ($request->role) {
            case 'student':
                $rules['registration_type'] = 'required|in:new,local';
                $rules['gender'] = 'required|in:male,female';
                $rules['class_id'] = 'nullable|exists:class_rooms,id';
                $rules['verification_method'] = 'required|in:email,phone';
                
                // Conditional validation based on registration type
                if ($request->registration_type === 'new') {
                    // New students: Grade 9 only, require Grade 8 info
                    $rules['grade'] = 'required|in:9';
                    $rules['previous_school'] = 'required|string|max:255';
                    $rules['grade_8_result'] = 'required|string|max:50';
                    $rules['grade_8_evaluation'] = 'required|in:percentage,gpa,letter_grade,points,other';
                } else {
                    // Local students: Grades 9-12, no Grade 8 info required
                    $rules['grade'] = 'required|in:9,10,11,12';
                }

                if ($request->verification_method === 'phone') {
                    $rules['phone'] = 'required|string|max:20';
                }
                break;
                
            case 'teacher':
                $rules['subject_specialization'] = 'required|string|max:255';
                $rules['qualification'] = 'required|string|max:255';
                $rules['experience_years'] = 'nullable|string|max:50';
                break;
                
            case 'parent':
                $rules['phone'] = 'required|string|max:20';
                $rules['address'] = 'required|string|max:500';
                $rules['emergency_contact'] = 'nullable|string|max:20';
                break;
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        // Create user
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'verification_code' => rand(100000, 999999),
            'verification_code_expires_at' => now()->addHours(24),
            'is_verified' => false,
            'is_approved' => false  // Require admin approval
        ]);

        // Create role-specific profile with additional data
        $profileData = $this->createRoleProfile($user, $request->role, $request);

        // Send registration notification email
        try {
            $studentId = $request->role === 'student' && isset($profileData['student_code']) 
                ? $profileData['student_code'] 
                : null;

            if ($request->role === 'student') {
                if ($request->verification_method === 'phone') {
                    $user->notify(new RegistrationSMS($user->phone, $studentId, $user->verification_code));
                } else {
                    $user->notify(new RegistrationSuccess($studentId, $user->verification_code));
                }
            } else {
                // Send email notification
                $user->notify(new RegistrationSuccess($studentId, $user->verification_code));
                
                // Send SMS notification if phone number provided
                if ($user->phone) {
                    $user->notify(new RegistrationSMS($user->phone, $studentId, $user->verification_code));
                }
            }
        } catch (\Exception $e) {
            // Log error but don't fail registration
            \Log::error('Failed to send registration notifications: ' . $e->getMessage());
        }

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = [
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'profile_picture' => $user->profile_picture,
                'profile_picture_url' => $user->profile_picture ? Storage::url($user->profile_picture) : null
            ],
            'message' => $request->role === 'student' && $request->verification_method === 'phone'
                ? 'Registration successful! Your account is pending admin approval. You will be notified once approved.'
                : 'Registration successful! Your account is pending admin approval. Please check your email for verification code.'
        ];

        // Add student_id to response if student
        if ($request->role === 'student' && isset($profileData['student_code'])) {
            $response['student_id'] = $profileData['student_code'];
        }

        return response()->json($response, 201);
    }

    /**
     * Create role-specific profile for the user
     */
    private function createRoleProfile(User $user, string $role, Request $request)
    {
        $profileData = [];
        
        switch ($role) {
            case 'student':
                // Auto-generate student code
                $studentCode = 'STU' . date('Y') . str_pad($user->id, 4, '0', STR_PAD_LEFT);
                
                $studentData = [
                    'user_id' => $user->id,
                    'class_id' => $request->class_id ?: null,
                    'student_code' => $studentCode,
                    'grade' => $request->grade,
                    'gender' => $request->gender
                ];
                
                // Add Grade 8 information for new students
                if ($request->registration_type === 'new') {
                    $studentData['previous_school'] = $request->previous_school;
                    $studentData['grade_8_result'] = $request->grade_8_result;
                    $studentData['grade_8_evaluation'] = $request->grade_8_evaluation;
                }
                
                \App\Models\Student::create($studentData);
                
                $profileData['student_code'] = $studentCode;
                break;
                
            case 'teacher':
                \App\Models\Teacher::create([
                    'user_id' => $user->id,
                    'subject_specialization' => $request->subject_specialization,
                    'qualification' => $request->qualification,
                    'experience_years' => $request->experience_years
                ]);
                break;
                
            case 'parent':
                \App\Models\ParentModel::create([
                    'user_id' => $user->id,
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'emergency_contact' => $request->emergency_contact
                ]);
                break;
        }
        
        return $profileData;
    }

    // 🔹 LOGIN (All roles)
    // POST /api/login
    public function login(Request $request)
    {
        // Check if it's student login (name + student_id) or regular login (email + password)
        if ($request->has('student_id') && $request->has('name')) {
            return $this->studentLogin($request);
        }
        
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        // Use default guard instead of web guard
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();

        // Check if user is approved
        if (!$user->is_approved) {
            Auth::logout();
            return response()->json([
                'success' => false,
                'message' => 'Your account is pending admin approval. Please wait for approval before logging in.'
            ], 403);
        }

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'profile_picture' => $user->profile_picture,
                'profile_picture_url' => $user->profile_picture ? Storage::url($user->profile_picture) : null
            ]
        ]);
    }

    // 🔹 STUDENT LOGIN (Name + Student ID)
    // POST /api/login
    private function studentLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'       => 'required|string',
            'student_id' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        // Find student by student_code
        $student = \App\Models\Student::where('student_code', $request->student_id)->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Student ID'
            ], 401);
        }

        // Get the user and verify name matches
        $user = $student->user;
        
        if (!$user || strtolower($user->name) !== strtolower($request->name)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Log the user in
        Auth::login($user);

        // Check if user is approved
        if (!$user->is_approved) {
            Auth::logout();
            return response()->json([
                'success' => false,
                'message' => 'Your account is pending admin approval. Please wait for approval before logging in.'
            ], 403);
        }

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'profile_picture' => $user->profile_picture,
                'profile_picture_url' => $user->profile_picture ? Storage::url($user->profile_picture) : null
            ]
        ]);
    }

    // 🔹 LOGOUT
    // POST /api/logout
    public function logout(Request $request)
    {
        // Delete current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    // 🔹 AUTH USER INFO
    // GET /api/me
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }
}
