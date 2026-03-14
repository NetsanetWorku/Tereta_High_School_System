<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->string('subject_specialization')->nullable()->after('user_id');
            $table->string('qualification')->nullable()->after('subject_specialization');
            $table->string('experience_years')->nullable()->after('qualification');
            $table->date('hire_date')->nullable()->after('experience_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn(['subject_specialization', 'qualification', 'experience_years', 'hire_date']);
        });
    }
};