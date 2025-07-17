import { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../sockets/socket';

interface Student {
    id: string;
    name: string;
    socketId: string;
}
const ParticipantsList = ({ isTeacher }: { isTeacher: boolean }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const handleKick = (id:string ,socketId: string) => {
        socket.emit('kick_student', id, socketId);
        fetchStudents();
    };
    const fetchStudents = async () => {
        try {
            const response = await axios.get('https://live-polling-backend-1-rxnh.onrender.com/students/list');
            setStudents(response.data.students)

        } catch {
            console.log('Error fetching students');
        }
    }
    useEffect(() => {
        fetchStudents();
    }, []);
    return (
        <table className="w-full text-left text-sm">
            <thead>
                <tr>
                    <th className="font-medium text-gray-500 pb-2">Name</th>
                    {isTeacher && (
                        <th className="font-medium text-gray-500 pb-2 text-right">Action</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {students.map((obj, index) => (
                    <tr key={index} className="border-t">
                        <td className="py-2 font-semibold">{obj.name}</td>
                        <td className="py-2 text-right">
                            {isTeacher && (
                                <button onClick={() => handleKick(obj.id,obj.socketId)} className="text-blue-600 hover:underline text-sm">
                                    Kick out
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ParticipantsList;
