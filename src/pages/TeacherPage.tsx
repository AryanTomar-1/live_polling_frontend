import React, { useEffect, useState, useRef } from 'react';
import socket from '../sockets/socket';
import { useNavigate } from 'react-router-dom';
import FloatingChatButton from '../components/FloatingChatButton'

interface Option {
    text: string;
    isCorrect: boolean | null;
}

export default function TeacherPage() {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<Option[]>([
        { text: '', isCorrect: null },
        { text: '', isCorrect: null },
    ]);
    const [askQuestion, setAskQuestion] = useState(true);
    const [duration, setDuration] = useState(60);
    const [liveResults, setLiveResults] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [timer, setTimer] = useState<number>(60);
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        socket.emit('teacher_joined', { id: '1' });

        socket.on('live_results', (results: Record<number, number>) => {
            setLiveResults(results);
        });

        socket.on('poll_results', (finalResults: Record<number, number>) => {
            setLiveResults(finalResults);
            setShowResults(true);
            setTimerActive(false);
        });

        return () => {
            socket.off('live_results');
            socket.off('poll_results');
        };
    }, []);

    const timerRef = useRef<number>(0);

    useEffect(() => {
        if (!timerActive) return;

        timerRef.current = timer; // Initialize with latest timer value

        const interval = setInterval(() => {
            if (timerRef.current <= 0) {
                clearInterval(interval);
                setTimer(0);
            } else {
                timerRef.current -= 1;
                setTimer(timerRef.current);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timerActive]);


    const handleOptionChange = (
        index: number,
        field: 'text' | 'isCorrect',
        value: string | boolean
    ) => {
        const updated = [...options];
        updated[index] = {
            ...updated[index],
            [field]: field === 'text' ? value : value === 'yes',
        };
        setOptions(updated);
    };

    const handleAskNewQuestion = () => {
        setAskQuestion(true);
        setShowResults(false);
    }

    const handleQuestionHistory = () => {
        navigate('/questionHistory');
    }

    const addOption = () => {
        setOptions([...options, { text: '', isCorrect: null }]);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            const updated = options.filter((_, i) => i !== index);
            setOptions(updated);
        }
    };

    const handleAskQuestion = () => {
        const validOptions = options.filter((opt) => opt.text.trim() !== '');
        if (!question.trim() || validOptions.length < 2) return;

        const pollToSend = {
            question,
            options: validOptions.map((opt) => opt.text),
            duration,
        };

        socket.emit('create_poll', pollToSend);
        setShowResults(true);
        setLiveResults({});
        setTimer(duration);
        setTimerActive(true);
        setAskQuestion(false);
    };

    const totalVotes = Object.values(liveResults).reduce((sum, count) => sum + count, 0);

    return (
        <div className="min-h-screen bg-white px-6 py-10">
            <div className="flex justify-between items-center mb-6">
                <span
                    className="px-3 py-1 rounded-full font-medium text-sm flex items-center gap-2"
                    style={{ backgroundColor: '#7765DA', color: '#ffffff' }}
                >
                    <span>✨</span> Intervue Poll
                </span>

                {(!showResults || timer === 0) && (
                    <button
                        onClick={handleQuestionHistory}
                        className="bg-[#7765DA] hover:bg-[#6654c7] text-white px-6 py-2 rounded-full font-medium transition"
                    >
                        View Poll history
                    </button>
                )}
            </div>

            {askQuestion && (
                <div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Let’s <span className="text-black font-bold">Get Started</span>
                        </h1>
                        <p className="text-gray-500 mt-1">
                            You’ll have the ability to create and manage polls, ask questions, and monitor your students’ responses in real-time.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">Enter your question</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="border rounded-md text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                {[30, 45, 60, 90].map((sec) => (
                                    <option key={sec} value={sec}>{sec} seconds</option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            maxLength={100}
                            rows={3}
                            placeholder="Type your question here..."
                            className="w-full border bg-[#F2F2F2] rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">{question.length}/100</div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-gray-700">Edit Options</h3>
                            <span className="text-sm font-semibold text-gray-600">Is it Correct?</span>
                        </div>
                        {options.map((opt, index) => (
                            <div key={index} className="flex items-center mb-4">
                                <span className="w-6 h-6 flex items-center justify-center bg-[#8F64E1] text-sm rounded-full mr-3 text-white">{index + 1}</span>
                                <input
                                    type="text"
                                    className="flex-1 border rounded-md px-3 py-2 text-sm mr-4 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-[#F2F2F2]"
                                    placeholder={`Option ${index + 1}`}
                                    value={opt.text}
                                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                />
                                <div className="flex flex-col mr-4 text-sm text-gray-700">
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name={`correct-${index}`}
                                                checked={opt.isCorrect === true}
                                                onChange={() => handleOptionChange(index, 'isCorrect', 'yes')}
                                            />
                                            Yes
                                        </label>
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name={`correct-${index}`}
                                                checked={opt.isCorrect === false}
                                                onChange={() => handleOptionChange(index, 'isCorrect', 'no')}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                                {options.length > 2 && (
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="text-red-500 hover:underline text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addOption}
                            className="text-purple-600 font-medium text-sm mt-2 px-3 py-1 hover:underline"
                        >
                            + Add More Option
                        </button>
                    </div>

                    <div className="flex justify-end mt-21">
                        <button
                            onClick={handleAskQuestion}
                            className="bg-[#7765DA] hover:bg-[#6654c7] text-white px-6 py-2 rounded-full font-medium transition"
                        >
                            Ask Question
                        </button>
                    </div>
                </div>
            )}

            {showResults && (
                <div className="max-w-xl mx-auto p-6 mt-10">
                    <div className="max-w-xl mx-auto p-6 border rounded-md shadow bg-white mt-10">
                        <h2 className="text-lg font-semibold mb-3">Question</h2>


                        <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-3 rounded-t-md text-sm font-medium">
                            {question}
                        </div>


                        <div className="border border-t-0 rounded-b-md px-4 py-4 space-y-4 bg-white">
                            {options.map((opt, index) => {
                                const count = liveResults[index] || 0;
                                const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                                return (
                                    <div
                                        key={index}
                                        className="relative flex items-center justify-between border border-purple-200 rounded-md overflow-hidden bg-gray-100"
                                    >

                                        <div
                                            className="absolute left-0 top-0 h-full bg-[#7765DA] opacity-100 transition-all z-0"
                                            style={{ width: `${percent}%` }}
                                        ></div>

                                        <div className="flex items-center z-10 px-4 py-2 w-full">

                                            <div className="w-6 h-6 text-xs font-bold text-[#7765DA] bg-white rounded-full flex items-center justify-center mr-3">
                                                {index + 1}
                                            </div>

                                            <span className="text-sm font-medium text-black z-10 truncate">{opt.text}</span>

                                            <div className="flex-grow" />

                                            <span className="text-sm font-semibold text-black bg-gray-100 px-2 py-1 rounded-md">
                                                {percent}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-center text-sm font-medium text-gray-600 mt-4">
                            ⏱️ Time Left: 00:{timer < 10 ? `0${timer}` : timer}
                        </div>
                    </div>
                    {timer === 0 && (
                        <div className="flex justify-end mt-10">
                            <button
                                onClick={handleAskNewQuestion}
                                className="bg-[#7765DA] hover:bg-[#6654c7] text-white px-6 py-2 rounded-full font-medium transition"
                            >
                                + Ask a new question
                            </button>
                        </div>
                    )}
                </div>
            )}

            <FloatingChatButton isTeacher={true} />
        </div>
    );
}
