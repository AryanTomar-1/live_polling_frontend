import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

interface PollResult {
  question: string;
  options: string[];
  answers: Record<string, number>;
  active: boolean;
  startTime: number;
  duration: number;
}

const PollHistory = () => {
  const [questions, setQuestions] = useState<PollResult[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null); // ref to scroll container
  const bottomRef = useRef<HTMLDivElement>(null); // ref to bottom anchor

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://live-polling-backend-1-rxnh.onrender.com/questions/all');
        setQuestions(response.data.history);
      } catch (error) {
        console.error("Error fetching poll history", error);
      }
    };

    fetchQuestions();
  }, []);

  // Scroll to bottom when new questions are loaded
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions]);

  return (
    <div className="min-h-screen px-4 py-10 bg-white flex justify-center">
      <div
        className="w-full max-w-3xl overflow-y-auto max-h-[80vh] pr-2"
        ref={scrollRef}
      >
        <h2 className="text-2xl font-semibold mb-6">
          View <span className="font-bold">Poll History</span>
        </h2>

        {questions.map((poll, pollIndex) => {
          const totalVotes = Object.values(poll.answers).reduce((sum, count) => sum + count, 0);
          return (
            <div key={pollIndex} className="mb-10">
              <h3 className="font-semibold mb-2">Question {pollIndex + 1}</h3>
              <div className="border rounded-lg overflow-hidden shadow">
                <div className="bg-gray-700 text-white px-4 py-2 text-sm font-medium rounded-t">
                  {poll.question}
                </div>

                <div className="p-4 space-y-3">
                  {poll.options.map((option, index) => {
                    const count = poll.answers[index] || 0;
                    const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

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

                          <span className="text-sm font-medium text-black z-10 truncate">{option}</span>

                          <div className="flex-grow" />

                          <span className="text-sm font-semibold text-black bg-gray-100 px-2 py-1 rounded-md">
                            {percent}%
                          </span>
                        </div>
                      </div>

                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default PollHistory;
