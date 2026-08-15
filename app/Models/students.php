<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class students extends Model
{
    /** @use HasFactory<\Database\Factories\StudentsFactory> */
    use HasFactory;
    
    protected $fillable = [
        'student_name',
        'email',
        'ID_number',
        'course',
        'year_level',
    ];
}
