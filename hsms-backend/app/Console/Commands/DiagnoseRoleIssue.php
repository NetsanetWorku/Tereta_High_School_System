<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;

class DiagnoseRoleIssue extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'diagnose:roles {--user-id= : Specific user ID to check}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Diagnose role-related authorization issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Role Diagnosis Tool ===');
        $this->newLine();

        if ($this->option('user-id')) {
            $this->checkUserAuthentication((int) $this->option('user-id'));
        } else {
            $this->checkTeacherRoles();
            $this->newLine();
            $this->checkAllRoles();
        }

        return 0;
    }

    /**
     * Check all users with teacher profiles
     */
    private function checkTeacherRoles(): void
    {
        $this->info('Checking Teacher Accounts:');
        $this->line(str_repeat('-', 60));

        // Get all teachers with their user data
        $teachers = Teacher::with('user')->get();
        $totalTeachers = $teachers->count();

        $this->info("Total teachers found: {$totalTeachers}");
        $this->newLine();

        if ($totalTeachers === 0) {
            $this->warn('No teacher accounts found in the database!');
            return;
        }

        // Analyze role values
        $roleDistribution = [];
        $problematicUsers = [];

        foreach ($teachers as $teacher) {
            $user = $teacher->user;
            
            if (!$user) {
                $this->error("Teacher ID {$teacher->id} has no associated user!");
                continue;
            }

            $role = $user->role;
            
            // Count role distribution
            if (!isset($roleDistribution[$role])) {
                $roleDistribution[$role] = 0;
            }
            $roleDistribution[$role]++;

            // Check for issues
            $issues = [];
            
            // Check if role is not exactly "teacher"
            if ($role !== 'teacher') {
                $issues[] = "Role is '{$role}' instead of 'teacher'";
            }
            
            // Check for case sensitivity
            if (strtolower($role) === 'teacher' && $role !== 'teacher') {
                $issues[] = "Case mismatch: '{$role}' (should be lowercase 'teacher')";
            }
            
            // Check for whitespace
            if (trim($role) !== $role) {
                $issues[] = "Whitespace detected: '" . str_replace(' ', '·', $role) . "'";
            }

            if (!empty($issues)) {
                $problematicUsers[] = [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $role,
                    'issues' => $issues
                ];
            }
        }

        // Display role distribution
        $this->info('Role Distribution:');
        foreach ($roleDistribution as $role => $count) {
            $indicator = $role === 'teacher' ? '✓' : '✗';
            $this->line("  {$indicator} '{$role}': {$count} users");
        }
        $this->newLine();

        // Display problematic users
        if (empty($problematicUsers)) {
            $this->info('✓ All teacher accounts have correct role values!');
        } else {
            $this->error('✗ Found ' . count($problematicUsers) . ' problematic teacher accounts:');
            $this->newLine();
            
            foreach ($problematicUsers as $user) {
                $this->line("User ID: {$user['user_id']}");
                $this->line("  Name: {$user['name']}");
                $this->line("  Email: {$user['email']}");
                $this->line("  Role: '{$user['role']}'");
                $this->line("  Issues:");
                foreach ($user['issues'] as $issue) {
                    $this->line("    - {$issue}");
                }
                $this->newLine();
            }
        }
    }

    /**
     * Check all user roles in the system
     */
    private function checkAllRoles(): void
    {
        $this->info('Checking All User Roles:');
        $this->line(str_repeat('-', 60));

        $allRoles = User::select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->get();

        $validRoles = ['admin', 'teacher', 'student', 'parent'];
        
        $this->info('Role Distribution Across All Users:');
        foreach ($allRoles as $roleData) {
            $role = $roleData->role;
            $count = $roleData->count;
            $isValid = in_array($role, $validRoles);
            $indicator = $isValid ? '✓' : '✗';
            
            $this->line("  {$indicator} '{$role}': {$count} users");
        }
        $this->newLine();

        // Check for invalid roles
        $invalidRoles = $allRoles->filter(function ($roleData) use ($validRoles) {
            return !in_array($roleData->role, $validRoles);
        });

        if ($invalidRoles->count() > 0) {
            $this->error('✗ Found invalid role values!');
            $this->warn('Valid roles are: ' . implode(', ', $validRoles));
        } else {
            $this->info('✓ All roles are valid!');
        }
    }

    /**
     * Check authentication for a specific user
     */
    private function checkUserAuthentication(int $userId): void
    {
        $this->info("Checking User ID: {$userId}");
        $this->line(str_repeat('-', 60));

        $user = User::find($userId);

        if (!$user) {
            $this->error("User ID {$userId} not found!");
            return;
        }

        $this->info('User Details:');
        $this->line("  ID: {$user->id}");
        $this->line("  Name: {$user->name}");
        $this->line("  Email: {$user->email}");
        $this->line("  Role: '{$user->role}'");
        $this->newLine();

        // Check if role is valid
        $validRoles = ['admin', 'teacher', 'student', 'parent'];
        $isValidRole = in_array($user->role, $validRoles);
        
        if ($isValidRole) {
            $this->info("✓ Role '{$user->role}' is valid");
        } else {
            $this->error("✗ Role '{$user->role}' is INVALID");
            $this->warn('Valid roles are: ' . implode(', ', $validRoles));
        }

        // Check for case/whitespace issues
        $trimmedRole = trim($user->role);
        $lowercaseRole = strtolower($user->role);
        
        if ($trimmedRole !== $user->role) {
            $this->warn("✗ Role has whitespace: '" . str_replace(' ', '·', $user->role) . "'");
        }
        
        if ($lowercaseRole !== $user->role) {
            $this->warn("✗ Role has uppercase characters: '{$user->role}' (should be '{$lowercaseRole}')");
        }

        // Check profile associations
        $this->newLine();
        $this->info('Profile Associations:');
        
        $teacher = Teacher::where('user_id', $userId)->first();
        if ($teacher) {
            $this->line("  ✓ Has Teacher profile (ID: {$teacher->id})");
            if ($user->role !== 'teacher') {
                $this->error("    ✗ But user role is '{$user->role}' instead of 'teacher'!");
            }
        }

        $student = \App\Models\Student::where('user_id', $userId)->first();
        if ($student) {
            $this->line("  ✓ Has Student profile (ID: {$student->id})");
            if ($user->role !== 'student') {
                $this->error("    ✗ But user role is '{$user->role}' instead of 'student'!");
            }
        }

        $parent = \App\Models\ParentModel::where('user_id', $userId)->first();
        if ($parent) {
            $this->line("  ✓ Has Parent profile (ID: {$parent->id})");
            if ($user->role !== 'parent') {
                $this->error("    ✗ But user role is '{$user->role}' instead of 'parent'!");
            }
        }

        // Test token creation
        $this->newLine();
        $this->info('Testing Token Creation:');
        try {
            $token = $user->createToken('diagnostic_test')->plainTextToken;
            $this->info('  ✓ Token created successfully');
            $this->line("  Token (first 20 chars): " . substr($token, 0, 20) . "...");
            
            // Clean up test token
            $user->tokens()->where('name', 'diagnostic_test')->delete();
        } catch (\Exception $e) {
            $this->error('  ✗ Failed to create token: ' . $e->getMessage());
        }
    }
}
