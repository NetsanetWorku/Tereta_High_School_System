<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'section',
        'grade',
        'capacity'
    ];

    /**
     * Get the students for the classroom.
     */
    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    /**
     * Get the subjects taught in this classroom.
     */
    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'teacher_subjects', 'class_id', 'subject_id');
    }

    /**
     * Get the full name of the class (name + section).
     */
    public function getFullNameAttribute(): string
    {
        return $this->name . ' - ' . $this->section;
    }
}
