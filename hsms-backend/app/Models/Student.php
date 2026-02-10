<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'class_id',
        'student_code',
        'grade',
        'gender',
        'previous_school',
        'grade_8_result',
        'grade_8_evaluation'
    ];

    /**
     * Get the user that owns the student.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the classroom that the student belongs to.
     */
    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class, 'class_id');
    }

    /**
     * Get the parents associated with the student.
     */
    public function parents()
    {
        return $this->belongsToMany(ParentModel::class, 'parent_student', 'student_id', 'parent_model_id');
    }

    /**
     * Get the attendance records for the student.
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get the results for the student.
     */
    public function results()
    {
        return $this->hasMany(Result::class);
    }

    /**
     * Get the student's full name from user relationship.
     */
    public function getFullNameAttribute(): string
    {
        return $this->user->name ?? '';
    }
}
