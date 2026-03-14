<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Add teacher_id to track who marked the attendance
            $table->foreignId('teacher_id')->nullable()->after('class_id')->constrained('teachers')->onDelete('set null');
            
            // Add subject_id to track which subject's class the attendance was for
            $table->foreignId('subject_id')->nullable()->after('teacher_id')->constrained('subjects')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->dropForeign(['subject_id']);
            $table->dropColumn(['teacher_id', 'subject_id']);
        });
    }
};
