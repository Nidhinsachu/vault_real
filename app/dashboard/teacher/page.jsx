"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

export default function Page() {
    const [teacherData, setTeacherData] = useState({ name: "", email: "" });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [selectedExamAttendance, setSelectedExamAttendance] = useState(null);
    const [exams, setExams] = useState([]);
    const [examAttendance, setExamAttendance] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [newChapter, setNewChapter] = useState("");
    const [examData, setExamData] = useState({
        examName: "",
        examDateTime: "",
        description: "",
        passKey: "",
        duration: ""
    });

    const router = useRouter();

    useEffect(() => {
        const teacherId = localStorage.getItem("userId");
        if (!teacherId) {
            alert("Teacher not logged in");
            router.push("/login");
            return;
        }
        const fetchData = async () => {
            try {
                const teacherResponse = await axios.get(`/api/users/${teacherId}`);
                if (teacherResponse.status === 200 && teacherResponse.data) {
                    setTeacherData({
                        email: teacherResponse.data.user.email,
                        name: teacherResponse.data.user.name,
                    });
                }
                const examResponse = await axios.get(`/api/exam?teacherId=${teacherId}`);
                if (examResponse.status === 200 && examResponse.data) {
                    setExams(examResponse.data.exams);
                    setExamAttendance(examResponse.data.attendance);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [router]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setExamData((prevData) => ({
            ...prevData,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleAddChapter = () => {
        if (newChapter.trim() !== "") {
            setChapters([...chapters, newChapter]);
            setNewChapter("");
        }
    };

    const handleAddQuestions = (examId, isExamFinished) => {
        router.push(`/exam/${examId}?isExamFinished=${isExamFinished}`);
    };

    const handleViewResults = (attendance) => {
        setSelectedExamAttendance(attendance);
        setIsResultsModalOpen(true);
    };

    const handlePublishResults = async (examId) => {
        try {
            const response = await axios.patch(`/api/exam/${examId}`, {});
            if (response.status === 200) {
                alert(`Results published for exam ${examId}`);
                fetchExamDetails();
                setIsResultsModalOpen(false);
            }
        } catch (error) {
            console.error("Error publishing results:", error);
            alert(`Failed to publish results: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleCreateExamination = async (e) => {
        e.preventDefault();
        const teacherId = localStorage.getItem("userId");

        if (!teacherId) {
            alert("Teacher not logged in");
            return;
        }

        try {
            const response = await axios.post("/api/exam", {
                ...examData,
                chapters,
                teacherId
            });

            if (response.status === 201) {
                alert("Exam created successfully!");
                setIsCreateModalOpen(false);
                fetchExamDetails();
            }
        } catch (error) {
            console.error("Error registering exam:", error.response?.data || error.message);
            alert("Failed to register exam. Please try again.");
        }
    };

    const fetchExamDetails = async () => {
        const teacherId = localStorage.getItem("userId");

        if (!teacherId) {
            alert("Teacher not logged in");
            return;
        }

        try {
            const examResponse = await axios.get(`/api/exam?teacherId=${teacherId}`);
            if (examResponse.status === 200 && examResponse.data) {
                setExams(examResponse.data.exams);
                setExamAttendance(examResponse.data.attendance);
            }
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    };



    return (
        <div className="flex min-h-screen">
            {/* Left Panel */}
            <div className="w-1/4 bg-gray-100 p-6 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6">Create an Examination in 'VAULT'</h2>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button

                            className={"bg-indigo-600 hover:bg-indigo-700"}

                        >Create Examination</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Exam Registration</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateExamination} className="space-y-4">
                            <Input
                                name="examName"
                                placeholder="Exam Name"
                                value={examData.examName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="number"
                                name="duration"
                                placeholder="Exam Duration (minutes)"
                                value={examData.duration}
                                onChange={handleChange}
                                required
                            />
                            <DatePicker
                                selected={examData.examDateTime ? new Date(examData.examDateTime) : null}
                                onChange={(date) => handleChange({ target: { name: "examDateTime", value: date } })}
                                showTimeSelect
                                dateFormat="Pp"
                                className="border p-2 rounded w-full"
                            />
                            <Textarea
                                name="description"
                                placeholder="Exam Description"
                                value={examData.description}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="passKey"
                                placeholder="Enter Passkey"
                                value={examData.passKey}
                                onChange={handleChange}
                                required
                            />
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Enter Chapter Name"
                                    value={newChapter}
                                    onChange={(e) => setNewChapter(e.target.value)}
                                />
                                <Button type="button" onClick={handleAddChapter}
                                    className={"bg-indigo-600 hover:bg-indigo-700"}

                                >Add Chapter</Button>
                            </div>
                            {chapters.length > 0 && (
                                <ul className="list-disc pl-5">
                                    {chapters.map((chapter, index) => (
                                        <li key={index}>{chapter}</li>
                                    ))}
                                </ul>
                            )}
                            <div className="flex justify-end space-x-2">
                                <Button type="submit"
                                    className={"bg-indigo-600 hover:bg-indigo-700"}


                                >Submit</Button>
                                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Right Panel */}
            <div className="w-3/4 p-6">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Teacher Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Name:</strong> {teacherData.name}</p>
                        <p><strong>Email:</strong> {teacherData.email}</p>
                    </CardContent>
                </Card>

                <h3 className="text-xl font-semibold mb-4">Your Exams</h3>
                {exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {exams.map((exam) => {
                            const attendance = examAttendance.find(att => att.examId === exam._id);
                            return (
                                <Card key={exam._id}>
                                    <CardHeader>
                                        <CardTitle>{exam.examName}</CardTitle>
                                        <CardDescription>{exam.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p><strong>Date & Time:</strong> {new Date(exam.examDateTime).toLocaleString()}</p>
                                        <p><strong>Duration:</strong> {exam.duration} mins</p>
                                        <p><strong>Passkey:</strong> {exam.passKey}</p>
                                        <div className="mt-4 space-y-2 space-x-2">
                                            <Button
                                                onClick={() => handleAddQuestions(exam._id, exam.isExamFinished)}
                                                className={"bg-indigo-600 hover:bg-indigo-700"}

                                            >
                                                {exam.isExamFinished ? "Question Selection" : "Add Questions"}
                                            </Button>
                                            {attendance && attendance.attendance && (
                                                <Dialog open={isResultsModalOpen} onOpenChange={setIsResultsModalOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleViewResults(attendance.attendance)}
                                                        >
                                                            View Results
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{exam.examName} - Student Results</DialogTitle>
                                                        </DialogHeader>
                                                        {selectedExamAttendance && selectedExamAttendance.students.length > 0 ? (
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>Student Name</TableHead>
                                                                        <TableHead>Score</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {selectedExamAttendance.students.map((student) => (
                                                                        <TableRow key={student._id}>
                                                                            <TableCell>{student.studentId.name}</TableCell>
                                                                            <TableCell>{student.score}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        ) : (
                                                            <p>No student results available.</p>
                                                        )}
                                                        <div className="mt-4 flex justify-end">
                                                            <Button
                                                                onClick={() => handlePublishResults(exam._id)}
                                                                className={"bg-indigo-600 hover:bg-indigo-700"}

                                                            >
                                                                Publish Results
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <p>No exams found.</p>
                )}
            </div>
        </div>
    );
}