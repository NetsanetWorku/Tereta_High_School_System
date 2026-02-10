<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentModel extends Model
{
    use HasFactory;

    protected $table = 'parents';

    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'emergency_contact'
    ];

    /**
     * Get the user that owns the parent.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the students associated with the parent.
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'parent_student', 'parent_model_id', 'student_id');
    }

    /**
     * Get the parent's full name from user relationship.
     */
    public function getFullNameAttribute(): string
    {
        return $this->user->name ?? '';
    }
}
