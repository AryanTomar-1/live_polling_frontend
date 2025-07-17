import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NamePrompt from '../components/NamePrompt';
import socket from '../sockets/socket';
import { Poll } from '../types/pollTypes';
import FloatingChatButton from '../components/FloatingChatButton';

export default function StudentPage() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(() => localStorage.getItem('studentName') || '');
  const [id,setId] = useState<string>(() => localStorage.getItem('studentId') || '');
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [finalResults, setFinalResults] = useState<Record<number, number>>({});

  const handleNameSubmit = (enteredName: string) => {
    const id=`${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('student_joined', {id:id, name: enteredName });
    localStorage.setItem('studentName', enteredName);
    setId(`${Date.now()}-${Math.floor(Math.random() * 10000)}`);
    localStorage.setItem('studentId',id)
    setName(enteredName);
  };
  useEffect(() => {
    if (localStorage.getItem('studentName') && localStorage.getItem('studentId')) {
      socket.emit('student_joined', {id:localStorage.getItem('studentId'),name: localStorage.getItem('studentName') });
    }else{
      if(localStorage.getItem('studentName')){
        localStorage.removeItem('studentName');
      }
      if(localStorage.getItem('studentId')){
        localStorage.removeItem('studentId');
      }
      setName('');
      setId('');
    }
  }, [])

  useEffect(() => {
    socket.on('new_poll', (pollData: Poll) => {
      setPoll(pollData);
      setSelectedOption(null);
      setSubmitted(false);
      setShowResults(false);
      setTimeLeft(pollData.duration);
    });

    socket.on('poll_results', (results: Record<number, number>) => {
      setFinalResults(results);
    });

    return () => {
      socket.off('new_poll');
      socket.off('poll_results');
    };
  }, [id]);

  useEffect(() => {
    socket.on('kicked', () => {
      localStorage.removeItem('studentName');
      localStorage.removeItem('studentId');
      setName('');
      setId('');
      socket.disconnect();
      navigate("/kicked");
    });
    return () => {
      socket.off('kicked');
    };
  }, []);

  useEffect(() => {
    if (!poll || showResults) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - poll.startTime) / 1000);
      const remaining = Math.max(0, poll.duration - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        setShowResults(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [poll, showResults]);

  const handleSubmit = () => {
    if (selectedOption !== null && poll?.active) {
      socket.emit('submit_answer', {id:id, option: selectedOption });
      setSubmitted(true);
    }
  };

  if (!name) return <NamePrompt onSubmit={handleNameSubmit} />;

  return (
    <div className="min-h-screen px-4 py-10 bg-white text-center">
      <h1 className="text-xl font-bold mb-6">Welcome, {name} 👋</h1>

      {!poll && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-700 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#7765DA]" />
          <p className="text-base font-semibold">Wait for teacher to ask questions...</p>
        </div>
      )}

      {/* Poll Live View */}
      {poll && !showResults && (
        <div className="max-w-xl mx-auto bg-white p-6 border rounded-md shadow">
          <div className="flex justify-between mb-3 text-sm font-semibold text-gray-700">
            <span>Question 1</span>
            <span className="text-red-500">⏱️ 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
          <div className="bg-gray-700 text-white px-4 py-3 rounded-t-md text-left text-sm font-medium">
            {poll.question}
          </div>

          <div className="border-l border-r border-gray-300 bg-white p-4 space-y-3">
            {poll.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center px-4 py-2 rounded-md border cursor-pointer transition text-sm ${selectedOption === index
                  ? 'border-[#7765DA] bg-purple-50'
                  : 'border-gray-200 hover:border-[#7765DA]'
                  }`}
              >
                <input
                  type="radio"
                  name="poll-option"
                  value={index}
                  className="mr-2 accent-[#7765DA]"
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                />
                {option}
              </label>
            ))}
          </div>

          <div className="flex justify-end px-4 py-4 border-t border-gray-300 bg-white rounded-b-md">
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || submitted}
              className={`px-6 py-2 rounded-full text-white font-medium transition ${selectedOption === null || submitted
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#7765DA] hover:bg-[#6654c7]'
                }`}
            >
              {submitted ? 'Submitted' : 'Submit'}
            </button>
          </div>
        </div>
      )}


      {poll && showResults && (
        <div className="max-w-xl mx-auto bg-white p-6 border rounded-md shadow">
          <div className="flex justify-between mb-3 text-sm font-semibold text-gray-700">
            <span>Question 1</span>
            <span className="text-red-500">⏱️ 00:00</span>
          </div>
          <div className="bg-gray-700 text-white px-4 py-3 rounded-t-md text-left text-sm font-medium">
            {poll.question}
          </div>

          <div className="border-l border-r border-gray-300 bg-white p-4 space-y-4">
            {poll.options.map((option, index) => {
              const count = finalResults?.[index] || 0;
              const total = Object.values(finalResults || {}).reduce((sum, val) => sum + val, 0);
              const percent = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-700 font-medium mb-1">
                    <span>{option}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="h-4 bg-[#7765DA] transition-all"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center py-3 text-sm font-medium text-gray-700 border-t border-gray-300">
            Wait for the teacher to ask a new question..
          </div>
        </div>
      )}
      <FloatingChatButton isTeacher={false} />
    </div>
  );
}
