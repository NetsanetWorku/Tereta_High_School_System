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
    Schema::create('results', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('student_id');         // matches students.id
        $table->unsignedBigInteger('subject_id');         // matches subjects.id
        $table->integer('marks');                         // 0-100 marks
        $table->string('grade')->nullable();              // A+, A, B+, B, C+, C, D, F
        $table->timestamps();

        $table->unique(['student_id', 'subject_id']);
        
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
