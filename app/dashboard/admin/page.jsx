// pages/admin/dashboard.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import {
    Button
} from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
    Alert, AlertDescription
} from '@/components/ui/alert';
import {
    Plus, Trash2, UserPlus, BookOpen
} from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: '' });
    const [deleteId, setDeleteId] = useState(null);
    const [deleteType, setDeleteType] = useState('');
    const [error, setError] = useState('');

    // Check admin role and fetch initial data
    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'admin') {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [teachersRes, studentsRes, examsRes] = await Promise.all([
                    axios.get('/api/users?role=teacher').catch(err => {
                        if (err.response?.status === 404) return { data: { users: [] } }; // No teachers found
                        throw err;
                    }),
                    axios.get('/api/users?role=student').catch(err => {
                        if (err.response?.status === 404) return { data: { users: [] } }; // No students found
                        throw err;
                    }),
                    axios.get('/api/exam').catch(err => { // Fixed to /api/exams
                        if (err.response?.status === 404) return { data: [] }; // No exams found
                        throw err;
                    }),
                ]);


                setTeachers(teachersRes.data.users || []); // Fallback to empty array
                setStudents(studentsRes.data.users || []); // Fallback to empty array
                setExams(examsRes.data.exams || []); // Fallback to empty array
            } catch (err) {
                console.error("Fetch error:", err.response?.data || err.message);
                setError('Failed to load data');
            }
        };
        fetchData();
    }, [router]);


    // Handle deleting a user or exam
    const handleDelete = async () => {
        try {
            if (deleteType === 'exam') {
                await axios.delete(`/api/exam/${deleteId}`);
                setExams(exams.filter(exam => exam._id !== deleteId));
            } else {
                await axios.delete(`/api/users/${deleteId}`);
                if (deleteType === 'teacher') {
                    setTeachers(teachers.filter(teacher => teacher._id !== deleteId));
                } else {
                    setStudents(students.filter(student => student._id !== deleteId));
                }
            }
            setIsDeleteModalOpen(false);
            setDeleteId(null);
            setDeleteType('');
        } catch (err) {
            setError('Failed to delete');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Teachers</span>

                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.map(teacher => (
                                    <TableRow key={teacher._id}>
                                        <TableCell>{teacher.name}</TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setDeleteId(teacher._id);
                                                    setDeleteType('teacher');
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className={"bg-indigo-600 hover:bg-indigo-700"}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Students Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Students</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map(student => (
                                    <TableRow key={student._id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setDeleteId(student._id);
                                                    setDeleteType('student');
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className={"bg-indigo-600 hover:bg-indigo-700"}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Exams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Exam Name</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exams.map(exam => (
                                    <TableRow key={exam._id}>
                                        <TableCell>{exam.examName}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                className={"bg-indigo-600 hover:bg-indigo-700"}
                                                size="sm"
                                                onClick={() => {
                                                    setDeleteId(exam._id);
                                                    setDeleteType('exam');
                                                    setIsDeleteModalOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>



            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this {deleteType}?</p>
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}