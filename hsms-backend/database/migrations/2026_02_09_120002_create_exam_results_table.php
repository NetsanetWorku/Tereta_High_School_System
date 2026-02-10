<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_schedule_id')->constrained('exam_schedules')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->integer('marks_obtained');
            $table->string('grade')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
            
            // Unique constraint to prevent duplicate results
            $table->unique(['exam_schedule_id', 'student_id']);
            
            // Index for faster queries
            $table->index('student_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_results');
    }
};
