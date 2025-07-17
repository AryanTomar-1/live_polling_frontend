import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface Props {
  children: React.ReactNode;
}

const TeacherProtectedRoute = ({ children }: Props) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null); // null = unknown
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const checkTeacherStatus = async () => {
      try {
        const response = await axios.get('https://live-polling-backend-1-rxnh.onrender.com/teacher/check');
        const teacherExists = response.data.Teacher;

        setIsAllowed(teacherExists);
      } catch (error) {
        console.error("Error checking teacher:", error);
        setIsAllowed(false); // default to false on error
      } finally {
        setLoading(false);
      }
    };

    checkTeacherStatus();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-sm">Checking access...</div>;
  }

  if (!isAllowed && !loading) {
    alert("A teacher is already present. Only one teacher can be present at a time.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default TeacherProtectedRoute;
