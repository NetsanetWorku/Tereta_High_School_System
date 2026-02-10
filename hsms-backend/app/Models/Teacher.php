<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subject_specialization',
        'qualification',
        'experience_years'
    ];

    /**
     * Get the user that owns the teacher.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subject assignments for the teacher.
     */
    public function subjects()
    {
        return $this->hasMany(TeacherSubject::class);
    }

    /**
     * Get the subjects that the teacher teaches.
     */
    public function teachingSubjects()
    {
        return $this->belongsToMany(Subject::class, 'teacher_subjects');
    }

    /**
     * Get the classrooms that the teacher teaches in.
     */
    public function classRooms()
    {
        return $this->belongsToMany(ClassRoom::class, 'teacher_subjects', 'teacher_id', 'class_room_id');
    }

    /**
     * Get the teacher's full name from user relationship.
     */
    public function getFullNameAttribute(): string
    {
        return $this->user->name ?? '';
    }
}
