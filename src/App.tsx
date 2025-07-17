import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import QuestionHistoryPage from './pages/PollHistory';
import KickedOutPage from './pages/KickedOut';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/questionHistory" element={<QuestionHistoryPage/>}/>
        <Route path="/kicked" element={<KickedOutPage />} />

      </Routes>
    </Router>
  );
}

export default App;
