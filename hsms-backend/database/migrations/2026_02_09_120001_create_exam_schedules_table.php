<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('class_id')->constrained('class_rooms')->onDelete('cascade');
            $table->date('exam_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('room_number')->nullable();
            $table->integer('total_marks')->default(100);
            $table->timestamps();
            
            // Index for faster queries
            $table->index(['exam_id', 'class_id']);
            $table->index('exam_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_schedules');
    }
};
