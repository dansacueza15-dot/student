<?php

namespace App\Http\Controllers;

use App\Models\students;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard', [
            'students' => students::latest()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('students', 'email')],
            'ID_number' => ['required', 'integer', Rule::unique('students', 'ID_number')],
            'course' => 'required|string|max:255',
            'year_level' => 'required|string|max:255',
        ]);

        students::create($data);

        return redirect()->route('dashboard');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, students $students)
    {
        $data = $request->validate([
            'student_name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('students', 'email')->ignore($students->id)],
            'ID_number' => ['required', 'integer', Rule::unique('students', 'ID_number')->ignore($students->id)],
            'course' => 'required|string|max:255',
            'year_level' => 'required|string|max:255',
        ]);

        $students->update($data);

        return redirect()->route('dashboard');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(students $students)
    {
        $students->delete();

        return redirect()->route('dashboard');
    }
}
