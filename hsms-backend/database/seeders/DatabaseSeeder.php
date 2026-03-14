<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ClassRoom;
use App\Models\Subject;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\ParentModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@school.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_approved' => true,
            'is_verified' => true,
        ]);

        // Create sample classrooms
        $classrooms = [
            ['name' => 'Grade 9', 'section' => 'A'],
            ['name' => 'Grade 9', 'section' => 'B'],
            ['name' => 'Grade 10', 'section' => 'A'],
            ['name' => 'Grade 10', 'section' => 'B'],
            ['name' => 'Grade 11', 'section' => 'A'],
            ['name' => 'Grade 12', 'section' => 'A'],
        ];

        foreach ($classrooms as $classroom) {
            ClassRoom::create($classroom);
        }

        // Create sample subjects
        $subjects = [
            ['name' => 'Mathematics', 'code' => 'MATH'],
            ['name' => 'English', 'code' => 'ENG'],
            ['name' => 'Science', 'code' => 'SCI'],
            ['name' => 'History', 'code' => 'HIST'],
            ['name' => 'Geography', 'code' => 'GEO'],
            ['name' => 'Physics', 'code' => 'PHY'],
            ['name' => 'Chemistry', 'code' => 'CHEM'],
            ['name' => 'Biology', 'code' => 'BIO'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }

        // Create sample teacher user and teacher record
        $teacherUser = User::create([
            'name' => 'John Teacher',
            'email' => 'teacher@school.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'is_approved' => true,
            'is_verified' => true,
        ]);

        Teacher::create([
            'user_id' => $teacherUser->id,
            'subject_specialization' => 'Mathematics',
            'qualification' => 'M.Ed in Mathematics',
            'experience_years' => 5,
            'hire_date' => '2020-01-15',
        ]);

        // Create additional teachers
        $additionalTeachers = [
            [
                'name' => 'Abinet Worku',
                'email' => 'abinet@school.com',
                'subject' => 'English',
                'qualification' => 'B.A in English Literature',
                'experience' => 3,
                'hire_date' => '2021-08-01',
            ],
            [
                'name' => 'Melese Mulu',
                'email' => 'melese@school.com',
                'subject' => 'Science',
                'qualification' => 'M.Sc in Physics',
                'experience' => 7,
                'hire_date' => '2018-09-01',
            ],
        ];

        foreach ($additionalTeachers as $teacherData) {
            $user = User::create([
                'name' => $teacherData['name'],
                'email' => $teacherData['email'],
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'is_approved' => true,
                'is_verified' => true,
            ]);

            Teacher::create([
                'user_id' => $user->id,
                'subject_specialization' => $teacherData['subject'],
                'qualification' => $teacherData['qualification'],
                'experience_years' => $teacherData['experience'],
                'hire_date' => $teacherData['hire_date'],
            ]);
        }

        // Create sample student user and student record
        $studentUser = User::create([
            'name' => 'Jane Student',
            'email' => 'student@school.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'is_approved' => true,
            'is_verified' => true,
        ]);

        Student::create([
            'user_id' => $studentUser->id,
            'class_id' => 1, // Grade 9 A
            'student_code' => 'STU001',
            'grade' => '9',
            'guardian_name' => 'Bob Parent',
            'guardian_phone' => '1234567890',
        ]);

        // Create sample parent user and parent record
        $parentUser = User::create([
            'name' => 'Bob Parent',
            'email' => 'parent@school.com',
            'password' => Hash::make('password'),
            'role' => 'parent',
            'is_approved' => true,
            'is_verified' => true,
        ]);

        $parent = ParentModel::create([
            'user_id' => $parentUser->id,
            'phone' => '1234567890',
            'address' => '123 Main Street',
            'emergency_contact' => '0987654321',
            'occupation' => 'Engineer',
        ]);

        // Create additional sample students
        $guardianNames = ['Alice Johnson', 'David Smith', 'Emma Brown', 'Michael Davis'];
        $guardianPhones = ['555-0101', '555-0102', '555-0103', '555-0104'];
        
        for ($i = 2; $i <= 5; $i++) {
            $studentUser = User::create([
                'name' => "Student $i",
                'email' => "student$i@school.com",
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_approved' => true,
                'is_verified' => true,
            ]);

            Student::create([
                'user_id' => $studentUser->id,
                'class_id' => ($i % 6) + 1, // Distribute across classes
                'student_code' => 'STU' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'grade' => (string)(9 + ($i % 4)), // Grades 9-12
                'guardian_name' => $guardianNames[$i - 2],
                'guardian_phone' => $guardianPhones[$i - 2],
            ]);
        }

        // Assign some students to the parent
        $student1 = Student::find(1);
        $student2 = Student::find(2);
        
        if ($student1 && $student2) {
            $parent->students()->attach([$student1->id, $student2->id]);
        }

        // Assign teachers to subjects and classes
        // John Teacher (Mathematics) teaches Grade 9A, 9B, and 10A
        $johnTeacher = Teacher::where('user_id', $teacherUser->id)->first();
        $mathSubject = Subject::where('code', 'MATH')->first();
        
        if ($johnTeacher && $mathSubject) {
            \DB::table('teacher_subjects')->insert([
                [
                    'teacher_id' => $johnTeacher->id,
                    'subject_id' => $mathSubject->id,
                    'class_id' => 1, // Grade 9A
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'teacher_id' => $johnTeacher->id,
                    'subject_id' => $mathSubject->id,
                    'class_id' => 2, // Grade 9B
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'teacher_id' => $johnTeacher->id,
                    'subject_id' => $mathSubject->id,
                    'class_id' => 3, // Grade 10A
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        // Assign other teachers to classes
        $abinetTeacher = Teacher::whereHas('user', function($q) {
            $q->where('email', 'abinet@school.com');
        })->first();
        $englishSubject = Subject::where('code', 'ENG')->first();
        
        if ($abinetTeacher && $englishSubject) {
            \DB::table('teacher_subjects')->insert([
                [
                    'teacher_id' => $abinetTeacher->id,
                    'subject_id' => $englishSubject->id,
                    'class_id' => 1, // Grade 9A
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'teacher_id' => $abinetTeacher->id,
                    'subject_id' => $englishSubject->id,
                    'class_id' => 2, // Grade 9B
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        $meleseTeacher = Teacher::whereHas('user', function($q) {
            $q->where('email', 'melese@school.com');
        })->first();
        $scienceSubject = Subject::where('code', 'SCI')->first();
        
        if ($meleseTeacher && $scienceSubject) {
            \DB::table('teacher_subjects')->insert([
                [
                    'teacher_id' => $meleseTeacher->id,
                    'subject_id' => $scienceSubject->id,
                    'class_id' => 3, // Grade 10A
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'teacher_id' => $meleseTeacher->id,
                    'subject_id' => $scienceSubject->id,
                    'class_id' => 4, // Grade 10B
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
