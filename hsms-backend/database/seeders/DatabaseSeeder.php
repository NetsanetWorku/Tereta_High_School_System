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
            'email' => 'admin@hsms.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
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
            'email' => 'teacher@hsms.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);

        Teacher::create([
            'user_id' => $teacherUser->id
        ]);

        // Create sample student user and student record
        $studentUser = User::create([
            'name' => 'Jane Student',
            'email' => 'student@hsms.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        Student::create([
            'user_id' => $studentUser->id,
            'class_id' => 1, // Grade 9 A
            'student_code' => 'STU001'
        ]);

        // Create sample parent user and parent record
        $parentUser = User::create([
            'name' => 'Bob Parent',
            'email' => 'parent@hsms.com',
            'password' => Hash::make('password'),
            'role' => 'parent',
        ]);

        $parent = ParentModel::create([
            'user_id' => $parentUser->id,
            'phone' => '1234567890',
            'address' => '123 Main Street'
        ]);

        // Create additional sample students
        for ($i = 2; $i <= 5; $i++) {
            $studentUser = User::create([
                'name' => "Student $i",
                'email' => "student$i@hsms.com",
                'password' => Hash::make('password'),
                'role' => 'student',
            ]);

            Student::create([
                'user_id' => $studentUser->id,
                'class_id' => ($i % 6) + 1, // Distribute across classes
                'student_code' => 'STU' . str_pad($i, 3, '0', STR_PAD_LEFT)
            ]);
        }

        // Assign some students to the parent
        $student1 = Student::find(1);
        $student2 = Student::find(2);
        
        if ($student1 && $student2) {
            $parent->students()->attach([$student1->id, $student2->id]);
        }
    }
}
