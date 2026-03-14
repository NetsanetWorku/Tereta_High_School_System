<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'student_id',
        'submission_text',
        'attachment_url',
        'submitted_at',
        'marks_obtained',
        'feedback',
        'graded_at',
        'status',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'graded_at' => 'datetime',
    ];

    protected $appends = ['grade'];

    public function getGradeAttribute()
    {
        if ($this->marks_obtained === null || !$this->assignment) {
            return null;
        }
        
        $totalMarks = $this->assignment->total_marks;
        if ($totalMarks == 0) {
            return 0;
        }
        
        return round(($this->marks_obtained / $totalMarks) * 100, 2);
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
