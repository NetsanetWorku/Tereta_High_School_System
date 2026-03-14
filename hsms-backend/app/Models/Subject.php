<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'credits',
        'description'
    ];

    /**
     * Get the results for the subject.
     */
    public function results()
    {
        return $this->hasMany(Result::class);
    }

    /**
     * Get the teacher assignments for the subject.
     */
    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class);
    }

    /**
     * Get the teachers that teach this subject.
     */
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'teacher_subjects');
    }
}
