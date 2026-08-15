import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';

type Student = {
    id: number;
    student_name: string;
    email: string;
    ID_number: number;
    course: string;
    year_level: string;
};

type Props = {
    students: Student[];
};

const emptyForm = {
    student_name: '',
    email: '',
    ID_number: '',
    course: '',
    year_level: '',
};

export default function Dashboard({ students }: Props) {
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            ...form,
            ID_number: Number(form.ID_number),
        };

        if (editingId !== null) {
            router.put(`/students/${editingId}`, payload, {
                preserveScroll: true,
                onSuccess: () => resetForm(),
            });
            return;
        }

        router.post('/students', payload, {
            preserveScroll: true,
            onSuccess: () => resetForm(),
        });
    };

    const handleEdit = (student: Student) => {
        setEditingId(student.id);
        setForm({
            student_name: student.student_name,
            email: student.email,
            ID_number: String(student.ID_number),
            course: student.course,
            year_level: student.year_level,
        });
    };

    const handleDelete = (student: Student) => {
        router.delete(`/students/${student.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                <div className="rounded-xl border border-sidebar-border bg-white p-6 shadow-sm dark:bg-slate-900">
                    <h1 className="text-2xl font-semibold">Student Dashboard</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage student records and keep the list updated in real time.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-xl border border-sidebar-border bg-white p-6 shadow-sm dark:bg-slate-900"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                {editingId !== null ? 'Edit Student' : 'Add Student'}
                            </h2>
                            {editingId !== null && (
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="student_name">Student Name</Label>
                                <Input
                                    id="student_name"
                                    name="student_name"
                                    value={form.student_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Maria Reyes"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="student@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ID_number">Student ID</Label>
                                <Input
                                    id="ID_number"
                                    name="ID_number"
                                    type="number"
                                    value={form.ID_number}
                                    onChange={handleChange}
                                    placeholder="2024001"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="course">Course</Label>
                                <Input
                                    id="course"
                                    name="course"
                                    value={form.course}
                                    onChange={handleChange}
                                    placeholder="BSIT"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="year_level">Year Level</Label>
                                <Input
                                    id="year_level"
                                    name="year_level"
                                    value={form.year_level}
                                    onChange={handleChange}
                                    placeholder="1st Year"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                {editingId !== null ? 'Save Changes' : 'Add Student'}
                            </Button>
                        </div>
                    </form>

                    <div className="rounded-xl border border-sidebar-border bg-white p-6 shadow-sm dark:bg-slate-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Student List</h2>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                {students.length} total
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-lg border">
                            <table className="min-w-full divide-y divide-border text-left text-sm">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">ID</th>
                                        <th className="px-4 py-3 font-medium">Course</th>
                                        <th className="px-4 py-3 font-medium">Year</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-white dark:bg-slate-900">
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No students yet. Add one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student.id}>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{student.student_name}</div>
                                                    <div className="text-xs text-muted-foreground">{student.email}</div>
                                                </td>
                                                <td className="px-4 py-3">{student.ID_number}</td>
                                                <td className="px-4 py-3">{student.course}</td>
                                                <td className="px-4 py-3">{student.year_level}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(student)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(student)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
