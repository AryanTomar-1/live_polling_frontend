import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    const [role, setRole] = useState<'student' | 'teacher' | null>(null);
    const [isTeacher, setIsTeacher] = useState(false);


    const fetchQuestions = async () => {
        try {
            const response = await axios.get("https://ndn8j3x1-4000.inc1.devtunnels.ms/teacher/check");
            if (response.data.Teacher) {
                navigate('/teacher');
            } else {
                alert("Teacher is alread present ,only one teacher can be present at a time");
            }
            setIsTeacher(response.data.Teacher)
        } catch (error) {
            console.error("Error fetching check teacher ", error);
        }
    };

    const handleContinue = async() => {
        if (role === 'student') navigate('/student');
        else if (role === 'teacher') {
            fetchQuestions();
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

            <div className="flex items-center space-x-2 mb-6">
                <span
                    className="px-3 py-1 rounded-full font-medium text-sm flex items-center gap-2"
                    style={{ backgroundColor: '#7765DA', color: '#ffffff' }}
                >
                    <span>✨</span> Intervue Poll
                </span>
            </div>



            <div className="text-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
                    Welcome to the <span className="text-black font-bold">Live Polling System</span>
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                    Please select the role that best describes you to begin using the live polling system
                </p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-xl w-full">
                <div
                    onClick={() => setRole('student')}
                    className={`cursor-pointer border rounded-xl p-5 transition shadow-sm hover:shadow-md ${role === 'student' ? 'border-blue-600' : 'border-gray-200'
                        }`}
                >
                    <h3 className="font-semibold text-lg mb-1">I’m a Student</h3>
                    <p className="text-sm text-gray-500">
                        Participate in live questions and instantly see class responses.
                    </p>
                </div>

                <div
                    onClick={() => setRole('teacher')}
                    className={`cursor-pointer border rounded-xl p-5 transition shadow-sm hover:shadow-md ${role === 'teacher' ? 'border-blue-600' : 'border-gray-200'
                        }`}
                >
                    <h3 className="font-semibold text-lg mb-1">I’m a Teacher</h3>
                    <p className="text-sm text-gray-500">
                        Submit answers and view live poll results in real-time.
                    </p>
                </div>
            </div>


            <button
                disabled={!role}
                onClick={handleContinue}
                className={`w-40 py-2 rounded-full font-medium text-white transition ${role
                    ? 'bg-[#7765DA] hover:bg-[#6654c7]'
                    : 'bg-gray-300 cursor-not-allowed'
                    }`}
            >
                Continue
            </button>

        </div>
    );
}
