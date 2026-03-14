<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('results', function (Blueprint $table) {
            $table->enum('exam_type', ['assignment', 'test', 'midterm', 'final'])->default('test')->after('subject_id');
            $table->string('exam_name')->nullable()->after('exam_type');
        });
    }

    public function down(): void
    {
        Schema::table('results', function (Blueprint $table) {
            $table->dropColumn(['exam_type', 'exam_name']);
        });
    }
};
