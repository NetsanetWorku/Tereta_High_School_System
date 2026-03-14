<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('results', function (Blueprint $table) {
            // Add class_id for better filtering and validation
            $table->foreignId('class_id')->nullable()->after('subject_id')->constrained('class_rooms')->onDelete('cascade');
            
            // Add teacher_id to track who recorded the result
            $table->foreignId('teacher_id')->nullable()->after('class_id')->constrained('teachers')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('results', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropForeign(['teacher_id']);
            $table->dropColumn(['class_id', 'teacher_id']);
        });
    }
};
