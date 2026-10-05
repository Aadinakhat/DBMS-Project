import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, Armchair, User, BookOpen, Clock } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

export default function StudentTimetablePage() {
    const toast = useToast();
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(7); // Default: Asha Patel
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadStudents = async () => {
        try {
            const res = await api.get('/users', { role: 'STUDENT' });
            if (res.success && res.data.length > 0) {
                setStudents(res.data);
            }
        } catch (err) {
            console.error('Failed to load students:', err);
        }
    };

    const loadTimetable = async (studentId) => {
        try {
            setLoading(true);
            const res = await api.get(`/users/${studentId}/timetable`);
            if (res.success) {
                setTimetable(res.data);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    useEffect(() => {
        if (selectedStudentId) {
            loadTimetable(selectedStudentId);
        }
    }, [selectedStudentId]);

    const activeStudent = students.find(s => s.user_id === parseInt(selectedStudentId, 10));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Personalized Timetable</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Queried directly from Database View <code>vw_student_timetable</code> with assigned workstation seats
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium shadow-xs"
                    >
                        {students.map(s => (
                            <option key={s.user_id} value={s.user_id}>
                                {s.name} ({s.batch_name || 'Enrolled Student'})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Profile banner */}
            {activeStudent && (
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                            {activeStudent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800">{activeStudent.name}</h2>
                            <p className="text-xs text-slate-500">{activeStudent.email} &bull; Department: {activeStudent.dept_name}</p>
                        </div>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                        Batch: {activeStudent.batch_name || 'Assigned'}
                    </span>
                </div>
            )}

            {/* Timetable Cards Grid */}
            {loading ? (
                <LoadingSkeleton rows={4} cols={3} />
            ) : timetable.length === 0 ? (
                <EmptyState
                    icon={GraduationCap}
                    title="No laboratory sessions scheduled for this student"
                    description="Ensure student is enrolled in a batch and master timetable sessions are mapped."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timetable.map((session, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-blue-300 transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                        {session.day_name}
                                    </span>
                                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                                        {session.course_code}
                                    </span>
                                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                                        {session.course_name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">Instructor: {session.faculty_name}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <div>
                                    <span className="text-[10px] text-slate-400 block uppercase">Venue</span>
                                    <span className="font-semibold text-slate-800">{session.lab_name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-slate-400 block uppercase">Assigned Seat</span>
                                    {session.station_number ? (
                                        <span className="inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <Armchair className="w-3 h-3 text-emerald-600" />
                                            Station #{session.station_number}
                                        </span>
                                    ) : (
                                        <span className="text-[11px] text-amber-600 font-medium">Pending SP Allocation</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
