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
            // Drop the foreign key constraint first
            $table->dropForeign(['class_id']);
            
            // Modify the column to be nullable
            $table->unsignedBigInteger('class_id')->nullable()->change();
            
            // Re-add the foreign key constraint
            $table->foreign('class_id')->references('id')->on('class_rooms')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['class_id']);
            
            // Revert the column to not nullable (but this might fail if there are null values)
            $table->unsignedBigInteger('class_id')->nullable(false)->change();
            
            // Re-add the original foreign key constraint
            $table->foreign('class_id')->references('id')->on('class_rooms')->onDelete('cascade');
        });
    }
};