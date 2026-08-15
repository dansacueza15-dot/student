<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\students;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class StudentDashboardCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_users_can_view_students_on_the_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        students::create([
            'student_name' => 'Alice Johnson',
            'email' => 'alice@example.com',
            'ID_number' => 2024001,
            'course' => 'BSIT',
            'year_level' => '2nd Year',
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) =>
            $page->has('students', 1)
                ->where('students.0.student_name', 'Alice Johnson')
                ->where('students.0.email', 'alice@example.com')
        );
    }

    public function test_authenticated_users_can_create_and_delete_students()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('students.store'), [
            'student_name' => 'Bob Smith',
            'email' => 'bob@example.com',
            'ID_number' => 2024002,
            'course' => 'BSCS',
            'year_level' => '1st Year',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertDatabaseHas('students', ['student_name' => 'Bob Smith']);

        $student = students::first();

        $deleteResponse = $this->delete(route('students.destroy', $student));
        $deleteResponse->assertRedirect(route('dashboard'));
        $this->assertDatabaseMissing('students', ['id' => $student->id]);
    }
}
