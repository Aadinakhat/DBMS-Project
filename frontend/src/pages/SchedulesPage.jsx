import React, { useState, useEffect } from 'react';
import { 
    CalendarDays, 
    Plus, 
    Search, 
    Filter, 
    Trash2, 
    Users, 
    CheckCircle2, 
    AlertTriangle,
    Eye,
    Armchair
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function SchedulesPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState([]);
    const [filters, setFilters] = useState({ search: '', day_of_week: '', lab_id: '' });
    
    // Catalogs for creating schedule
    const [courses, setCourses] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [labs, setLabs] = useState([]);
    const [slots, setSlots] = useState([]);
    const [batches, setBatches] = useState([]);

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        course_id: '',
        faculty_id: '',
        lab_id: '',
        slot_id: '',
        batch_id: '',
        session_type: 'PRACTICAL'
    });
    const [submitting, setSubmitting] = useState(false);

    // Delete confirmation
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Seat Allocations viewer modal
    const [viewSchedule, setViewSchedule] = useState(null);
    const [allocations, setAllocations] = useState([]);
    const [loadingAllocations, setLoadingAllocations] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/schedules', filters);
            if (res.success) setSchedules(res.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCatalogs = async () => {
        try {
            const [cRes, uRes, lRes, sRes, bRes] = await Promise.all([
                api.get('/courses'),
                api.get('/users', { role: 'FACULTY' }),
                api.get('/labs'),
                api.get('/time-slots'),
                api.get('/batches')
            ]);
            if (cRes.success) setCourses(cRes.data);
            if (uRes.success) setFacultyList(uRes.data);
            if (lRes.success) setLabs(lRes.data);
            if (sRes.success) setSlots(sRes.data);
            if (bRes.success) setBatches(bRes.data);
        } catch (err) {
            console.error('Catalogs error:', err);
        }
    };

    useEffect(() => {
        loadData();
    }, [filters.day_of_week, filters.lab_id]);

    useEffect(() => {
        loadCatalogs();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const res = await api.post('/schedules', formData);
            if (res.success) {
                toast.success('Session scheduled successfully. Trigger trg_schedule_after_insert_audit logged event!');
                setIsAddOpen(false);
                setFormData({
                    course_id: '',
                    faculty_id: '',
                    lab_id: '',
                    slot_id: '',
                    batch_id: '',
                    session_type: 'PRACTICAL'
                });
                loadData();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const res = await api.delete(`/schedules/${deleteId}`);
            if (res.success) {
                toast.success('Schedule deleted successfully');
                setDeleteId(null);
                loadData();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleAllocateSeats = async (scheduleId) => {
        try {
            const res = await api.post(`/schedules/${scheduleId}/allocate-seats`);
            if (res.success) {
                toast.success(res.message);
                loadData();
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleViewAllocations = async (sched) => {
        try {
            setViewSchedule(sched);
            setLoadingAllocations(true);
            const res = await api.get(`/schedules/${sched.schedule_id}`);
            if (res.success) {
                setAllocations(res.data.allocations);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoadingAllocations(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Master Laboratory Timetable</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Guaranteed conflict-free via DB constraints: UNIQUE(lab_id, slot_id) & UNIQUE(faculty_id, slot_id)
                    </p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Add Session
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search course, lab, or faculty..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && loadData()}
                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    <select
                        value={filters.day_of_week}
                        onChange={(e) => setFilters(prev => ({ ...prev, day_of_week: e.target.value }))}
                        className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                    >
                        <option value="">All Days</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                    </select>

                    <select
                        value={filters.lab_id}
                        onChange={(e) => setFilters(prev => ({ ...prev, lab_id: e.target.value }))}
                        className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                    >
                        <option value="">All Laboratories</option>
                        {labs.map(l => (
                            <option key={l.lab_id} value={l.lab_id}>{l.lab_name}</option>
                        ))}
                    </select>

                    <button
                        onClick={loadData}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                        Apply Filter
                    </button>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-semibold text-slate-800">{schedules.length}</span> sessions
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <LoadingSkeleton rows={5} cols={6} />
            ) : schedules.length === 0 ? (
                <EmptyState
                    icon={CalendarDays}
                    title="No master schedule slots found"
                    description="Create a new session above to allocate laboratories."
                    action={
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium"
                        >
                            Create First Schedule
                        </button>
                    }
                />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Day & Time</th>
                                    <th className="py-3 px-4">Course</th>
                                    <th className="py-3 px-4">Assigned Lab</th>
                                    <th className="py-3 px-4">Faculty In-Charge</th>
                                    <th className="py-3 px-4">Batch</th>
                                    <th className="py-3 px-4">Type</th>
                                    <th className="py-3 px-4 text-center">Allocated Seats</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {schedules.map((s) => (
                                    <tr key={s.schedule_id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                                            <div className="font-semibold text-blue-700">{s.day_name}</div>
                                            <div className="text-[11px] text-slate-500 font-mono">
                                                {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-slate-800">{s.course_code}</span>
                                            <div className="text-[11px] text-slate-500 truncate max-w-xs">{s.course_name}</div>
                                        </td>
                                        <td className="py-3 px-4 font-medium text-slate-800">
                                            {s.lab_name}
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                                            {s.faculty_name}
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                                                {s.batch_name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                s.session_type === 'EXAM' 
                                                    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            }`}>
                                                {s.session_type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center whitespace-nowrap">
                                            {s.allocated_seats_count > 0 ? (
                                                <button
                                                    onClick={() => handleViewAllocations(s)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-medium transition-colors"
                                                >
                                                    <Armchair className="w-3.5 h-3.5 text-blue-600" />
                                                    {s.allocated_seats_count} Seats (View)
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAllocateSeats(s.schedule_id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-[11px] font-semibold transition-colors"
                                                    title="Run Stored Procedure sp_allocate_student_seats"
                                                >
                                                    <Users className="w-3.5 h-3.5 text-amber-600" />
                                                    Auto-Allocate (SP)
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => setDeleteId(s.schedule_id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                                                title="Delete Schedule"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Schedule Modal */}
            <Modal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Schedule New Master Laboratory Session"
                maxWidth="max-w-md"
            >
                <form onSubmit={handleCreate} className="space-y-4 text-xs">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-[11px]">
                        <strong>Database Invariant Note:</strong> The database enforces <code>UNIQUE(lab_id, slot_id)</code> and <code>UNIQUE(faculty_id, slot_id)</code>. If a conflict occurs, MySQL will return a structured constraint violation.
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Course</label>
                        <select
                            required
                            value={formData.course_id}
                            onChange={(e) => setFormData(p => ({ ...p, course_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select course...</option>
                            {courses.map(c => (
                                <option key={c.course_id} value={c.course_id}>
                                    {c.course_code} - {c.course_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Faculty In-Charge</label>
                        <select
                            required
                            value={formData.faculty_id}
                            onChange={(e) => setFormData(p => ({ ...p, faculty_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select professor...</option>
                            {facultyList.map(f => (
                                <option key={f.user_id} value={f.user_id}>{f.name} ({f.email})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Laboratory</label>
                        <select
                            required
                            value={formData.lab_id}
                            onChange={(e) => setFormData(p => ({ ...p, lab_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select laboratory...</option>
                            {labs.map(l => (
                                <option key={l.lab_id} value={l.lab_id}>
                                    {l.lab_name} (Cap: {l.capacity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Time Slot</label>
                        <select
                            required
                            value={formData.slot_id}
                            onChange={(e) => setFormData(p => ({ ...p, slot_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select weekly slot...</option>
                            {slots.map(s => (
                                <option key={s.slot_id} value={s.slot_id}>
                                    {s.day_name}: {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Student Batch</label>
                        <select
                            required
                            value={formData.batch_id}
                            onChange={(e) => setFormData(p => ({ ...p, batch_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select batch...</option>
                            {batches.map(b => (
                                <option key={b.batch_id} value={b.batch_id}>{b.batch_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Session Type</label>
                        <select
                            value={formData.session_type}
                            onChange={(e) => setFormData(p => ({ ...p, session_type: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="PRACTICAL">PRACTICAL</option>
                            <option value="EXAM">EXAM</option>
                            <option value="MAKEUP">MAKEUP</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsAddOpen(false)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                        >
                            {submitting ? 'Creating...' : 'Create Session'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* View Seat Allocations Modal */}
            <Modal
                isOpen={!!viewSchedule}
                onClose={() => setViewSchedule(null)}
                title={`Allocated Workstation Seats: ${viewSchedule?.course_code} (${viewSchedule?.batch_name})`}
                maxWidth="max-w-md"
            >
                {loadingAllocations ? (
                    <LoadingSkeleton rows={4} cols={3} />
                ) : (
                    <div className="space-y-3">
                        <div className="text-xs text-slate-500 mb-2">
                            Venue: <strong>{viewSchedule?.lab_name}</strong> &bull; Slot: <strong>{viewSchedule?.day_name} {viewSchedule?.start_time?.substring(0, 5)}</strong>
                        </div>
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                            {allocations.map((a, i) => (
                                <div key={i} className="p-2.5 text-xs flex items-center justify-between bg-slate-50/50">
                                    <div>
                                        <div className="font-semibold text-slate-800">{a.student_name}</div>
                                        <div className="text-[10px] text-slate-400">{a.student_email}</div>
                                    </div>
                                    <span className="font-mono font-bold px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
                                        Terminal #{a.station_number}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end pt-3">
                            <button
                                onClick={() => setViewSchedule(null)}
                                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Timetable Session"
                message="Are you sure you want to remove this scheduled session? Workstation allocations linked to this session will be removed automatically via ON DELETE CASCADE."
                confirmText="Delete Session"
                confirmVariant="danger"
                loading={deleting}
            />
        </div>
    );
}
