import React from 'react';

export default function PollResults({ results }: { results: Record<string, number> }) {
  const total = Object.values(results).reduce((a, b) => a + b, 0);

  return (
    <div className="h-screen flex justify-center items-center bg-[#F6F7FB] px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Poll Results</h2>
        <div className="space-y-4">
          {Object.entries(results).map(([option, count], i) => {
            const percent = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={i}>
                <p className="mb-1 text-gray-700 font-medium">{option}</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-sm text-right text-gray-500 mt-1">{percent}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
