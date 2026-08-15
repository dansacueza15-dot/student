import { Head } from '@inertiajs/react';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase';
import { dashboard } from '@/routes';

type Student = {
    id: string | number;
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

export default function Dashboard({ students: initialStudents }: Props) {
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [students, setStudents] = useState<Student[]>(initialStudents);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
            const nextStudents = snapshot.docs.map((studentDoc) => ({
                id: studentDoc.id,
                ...(studentDoc.data() as Omit<Student, 'id'>),
            }));

            setStudents(nextStudents);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            ...form,
            ID_number: Number(form.ID_number),
        };

        try {
            if (editingId !== null) {
                await updateDoc(doc(db, 'students', String(editingId)), payload);
            } else {
                await addDoc(collection(db, 'students'), payload);
            }

            resetForm();
        } catch (error) {
            console.error('Error saving student:', error);
        }
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

    const handleDelete = async (student: Student) => {
        try {
            await deleteDoc(doc(db, 'students', String(student.id)));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                <div className="rounded-xl border border-sidebar-border p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold">Student Dashboard</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage student records and keep the list updated in real time.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-xl border border-sidebar-border p-6 shadow-sm"
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

                    <div className="rounded-xl border border-sidebar-border p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Student List</h2>
                            <span className="rounded-full px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                {students.length} total
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-transparent">
                            <table className="min-w-full divide-y divide-border text-left text-sm">
                                <thead className="bg-transparent">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">ID</th>
                                        <th className="px-4 py-3 font-medium">Course</th>
                                        <th className="px-4 py-3 font-medium">Year</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-transparent">
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
