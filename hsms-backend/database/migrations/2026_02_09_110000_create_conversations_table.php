<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id');
            $table->unsignedBigInteger('teacher_id');
            $table->unsignedBigInteger('student_id')->nullable();
            $table->string('subject');
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('parent_id')->references('id')->on('parents')->onDelete('cascade');
            $table->foreign('teacher_id')->references('id')->on('teachers')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            
            // Index for faster queries
            $table->index(['parent_id', 'teacher_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
