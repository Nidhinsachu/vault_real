'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from 'lucide-react';

export default function StudentDashboard() {
    const [studentData, setStudentData] = useState({
        name: "",
        email: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [passKey, setPassKey] = useState("");
    const router = useRouter();
    const [examResults, setExamResults] = useState([]);

    useEffect(() => {
        const updateStudentDetails = async () => {
            const studentId = localStorage.getItem("userId");
            if (!studentId) {
                router.push("/login");
                return;
            }

            try {
                const response = await axios.get(`/api/users/${studentId}`);
                if (response.status === 200 && response.data) {
                    setStudentData({
                        email: response.data.user.email,
                        name: response.data.user.name
                    });
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        const fetchExamResults = async () => {
            const studentId = localStorage.getItem("userId");
            if (!studentId) {
                router.push("/login");
                return;
            }

            try {
                const res = await axios.get(`/api/exam/results?userId=${studentId}`);
                if (res.status === 200 && res.data.exams && res.data.exams.length > 0) {
                    setExamResults(res.data.exams);
                } else {
                    setExamResults([]); // If response is empty
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.warn("No exams found for this student.");
                    setExamResults([]);
                } else {
                    console.error("Error fetching exam results:", error);
                }
            }
        };

        updateStudentDetails();
        fetchExamResults();
    }, [router]);

    const handleSubmitPassKey = async () => {
        if (!passKey) {
            setError("Please enter a pass key");
            return;
        }

        try {
            const response = await axios.get(`/api/exam?passkey=${passKey}`);
            const examId = response.data.examId;

            if (response.status === 200) {
                router.push(`/exam/${examId}/attend`);
            }
        } catch (err) {
            setError("Invalid pass key. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instructions Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Welcome to VAULT</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                To attend an examination:
                            </p>
                            <ul className="list-disc list-inside text-gray-600">
                                <li>Click "Start Examination"</li>
                                <li>Enter your unique pass key</li>
                                <li>Begin your exam immediately</li>
                            </ul>
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Start Examination
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Student Profile Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Student Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="text-lg font-medium">{studentData.name || 'Loading...'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-lg font-medium">{studentData.email || 'Loading...'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Exam Results Section */}
            <div className="max-w-4xl mx-auto mt-10 space-y-4">
                <h2 className="text-2xl font-semibold">Your Exam Results</h2>
                {examResults.length === 0 ? (
                    <p className="text-gray-500">No exams attended yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {examResults.map((exam) => (
                            <Card key={exam.examId} className="bg-white shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold">{exam.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-gray-600">Date: {new Date(exam.date).toLocaleString()}</p>
                                    <p className="text-gray-600">Score: <span className="font-semibold text-green-600">{exam.score}</span></p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Pass Key Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Enter Examination Pass Key</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input
                            placeholder="Enter your pass key"
                            value={passKey}
                            onChange={(e) => setPassKey(e.target.value)}
                            className="w-full"
                        />
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="flex gap-4">
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={handleSubmitPassKey}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
