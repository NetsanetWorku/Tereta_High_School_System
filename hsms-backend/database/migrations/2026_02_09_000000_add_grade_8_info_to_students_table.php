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
        Schema::table('students', function (Blueprint $table) {
            $table->string('gender')->nullable()->after('grade');
            $table->string('previous_school')->nullable()->after('gender');
            $table->string('grade_8_result', 50)->nullable()->after('previous_school');
            $table->string('grade_8_evaluation', 50)->nullable()->after('grade_8_result');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['gender', 'previous_school', 'grade_8_result', 'grade_8_evaluation']);
        });
    }
};
