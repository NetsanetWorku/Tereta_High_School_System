<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('assignments')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->text('submission_text')->nullable();
            $table->string('attachment_url')->nullable();
            $table->dateTime('submitted_at')->nullable();
            $table->integer('marks_obtained')->nullable();
            $table->text('feedback')->nullable();
            $table->dateTime('graded_at')->nullable();
            $table->enum('status', ['pending', 'submitted', 'graded', 'late'])->default('pending');
            $table->timestamps();
            
            // Unique constraint to prevent duplicate submissions
            $table->unique(['assignment_id', 'student_id']);
            
            // Index for faster queries
            $table->index('student_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignment_submissions');
    }
};
