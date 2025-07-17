import React from "react";
import { useNavigate } from "react-router-dom";

export default function KickedOut() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center space-y-4">
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-full flex items-center mx-auto"
        >
          ✨ Intervue Poll
        </button>

        <h1 className="text-3xl font-semibold text-black">You’ve been Kicked out !</h1>
        <p className="text-gray-500 max-w-md mx-auto text-sm">
          Looks like the teacher had removed you from the poll system. Please try again sometime.
        </p>

        <button
          onClick={() => navigate(-1)} // or navigate("/") to home page
          className="mt-6 px-5 py-2 border border-gray-400 rounded-md text-sm hover:bg-gray-100 transition"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
