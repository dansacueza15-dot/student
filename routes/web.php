<?php

use App\Http\Controllers\StudentsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [StudentsController::class, 'index'])->name('dashboard');
    Route::post('students', [StudentsController::class, 'store'])->name('students.store');
    Route::put('students/{students}', [StudentsController::class, 'update'])->name('students.update');
    Route::delete('students/{students}', [StudentsController::class, 'destroy'])->name('students.destroy');
});

require __DIR__.'/settings.php';
