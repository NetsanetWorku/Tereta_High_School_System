<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('teacher_subjects', function (Blueprint $table) {
        $table->id();
        $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
        $table->foreignId('subject_id')->constrained();
        $table->foreignId('class_id')->constrained('class_rooms');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_subjects');
        Schema::create('teacher_subjects', function (Blueprint $table) {
    $table->id();
    $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
    $table->foreignId('subject_id')->constrained()->onDelete('cascade');
    $table->foreignId('class_id')->constrained('class_rooms')->onDelete('cascade');
    $table->timestamps();

    $table->unique(['teacher_id','subject_id','class_id']);
});

    }
};
