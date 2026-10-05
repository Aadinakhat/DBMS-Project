import React, { useState, useEffect } from 'react';
import { 
    Clock, 
    Plus, 
    Check, 
    X, 
    AlertTriangle, 
    CheckCircle2, 
    ShieldAlert, 
    Filter,
    Calendar
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function AdHocPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    // Catalogs for creating booking
    const [facultyList, setFacultyList] = useState([]);
    const [labs, setLabs] = useState([]);
    const [slots, setSlots] = useState([]);
    const [courses, setCourses] = useState([]);

    // Create Modal
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        faculty_id: '',
        lab_id: '',
        slot_id: '',
        course_id: '',
        request_date: new Date().toISOString().split('T')[0],
        reason: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Processing approval
    const [processingId, setProcessingId] = useState(null);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get('/ad-hoc', { status: statusFilter });
            if (res.success) setRequests(res.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCatalogs = async () => {
        try {
            const [uRes, lRes, sRes, cRes] = await Promise.all([
                api.get('/users', { role: 'FACULTY' }),
                api.get('/labs'),
                api.get('/time-slots'),
                api.get('/courses')
            ]);
            if (uRes.success) setFacultyList(uRes.data);
            if (lRes.success) setLabs(lRes.data);
            if (sRes.success) setSlots(sRes.data);
            if (cRes.success) setCourses(cRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [statusFilter]);

    useEffect(() => {
        loadCatalogs();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const res = await api.post('/ad-hoc', formData);
            if (res.success) {
                toast.success('Ad-hoc reservation submitted via Stored Procedure sp_book_ad_hoc_slot');
                setIsAddOpen(false);
                setFormData({
                    faculty_id: '',
                    lab_id: '',
                    slot_id: '',
                    course_id: '',
                    request_date: new Date().toISOString().split('T')[0],
                    reason: ''
                });
                loadRequests();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            setProcessingId(requestId);
            const res = await api.post(`/ad-hoc/${requestId}/approve`, { admin_id: 1 });
            if (res.success) {
                toast.success('Approved atomically via Stored Procedure sp_approve_ad_hoc_request!');
                loadRequests();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requestId) => {
        try {
            setProcessingId(requestId);
            const res = await api.post(`/ad-hoc/${requestId}/reject`, { admin_id: 1, reason: 'Administrative decline' });
            if (res.success) {
                toast.info('Ad-hoc reservation marked as REJECTED');
                loadRequests();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Ad-Hoc Laboratory Reservations</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        ACID transactional approval workflow handled by Stored Procedure <code>sp_approve_ad_hoc_request</code>
                    </p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Request Ad-Hoc Slot
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-semibold text-slate-800">{requests.length}</span> requests
                </span>
            </div>

            {/* List */}
            {loading ? (
                <LoadingSkeleton rows={5} cols={5} />
            ) : requests.length === 0 ? (
                <EmptyState
                    icon={Clock}
                    title="No ad-hoc requests found"
                    description="Submit a supplementary lab reservation request above."
                />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Req #</th>
                                    <th className="py-3 px-4">Faculty</th>
                                    <th className="py-3 px-4">Target Lab</th>
                                    <th className="py-3 px-4">Date & Slot</th>
                                    <th className="py-3 px-4">Purpose</th>
                                    <th className="py-3 px-4">Conflict Status</th>
                                    <th className="py-3 px-4">State</th>
                                    <th className="py-3 px-4 text-right">Approval Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requests.map((r) => {
                                    const hasConflict = r.clashes_with_master || r.clashes_with_approved;
                                    return (
                                        <tr key={r.request_id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 px-4 font-mono font-bold text-slate-400">
                                                #{r.request_id}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                                                {r.faculty_name}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                                                {r.lab_name}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <div className="font-semibold text-slate-800">
                                                    {new Date(r.request_date).toLocaleDateString()}
                                                </div>
                                                <div className="text-[11px] text-slate-500 font-mono">
                                                    {r.day_name}: {r.start_time?.substring(0, 5)} - {r.end_time?.substring(0, 5)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 max-w-xs">
                                                <div className="truncate">{r.reason || 'Supplementary session'}</div>
                                                {r.course_code && (
                                                    <span className="text-[10px] text-blue-600 font-medium">
                                                        Course: {r.course_code}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {hasConflict ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                                                        CLASH DETECTED
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                        SLOT CLEAR
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    r.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    r.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                {r.status === 'PENDING' ? (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => handleApprove(r.request_id)}
                                                            disabled={processingId === r.request_id}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                                                            title="Run sp_approve_ad_hoc_request"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                            Approve (SP)
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(r.request_id)}
                                                            disabled={processingId === r.request_id}
                                                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                                                            title="Reject Request"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400">
                                                        {r.reviewer_name ? `By ${r.reviewer_name}` : 'Completed'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Ad-Hoc Request Modal */}
            <Modal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Book Ad-Hoc Laboratory Slot"
                maxWidth="max-w-md"
            >
                <form onSubmit={handleCreate} className="space-y-4 text-xs">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                        <strong>Viva Note:</strong> Request insertion invokes Stored Procedure <code>sp_book_ad_hoc_slot</code>. Weekdays are validated against <code>WEEKDAY(date) + 1</code>.
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Faculty Member</label>
                        <select
                            required
                            value={formData.faculty_id}
                            onChange={(e) => setFormData(p => ({ ...p, faculty_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select faculty...</option>
                            {facultyList.map(f => (
                                <option key={f.user_id} value={f.user_id}>{f.name} ({f.email})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Target Laboratory</label>
                        <select
                            required
                            value={formData.lab_id}
                            onChange={(e) => setFormData(p => ({ ...p, lab_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select laboratory...</option>
                            {labs.map(l => (
                                <option key={l.lab_id} value={l.lab_id}>
                                    {l.lab_name} (Capacity: {l.capacity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Target Time Slot</label>
                        <select
                            required
                            value={formData.slot_id}
                            onChange={(e) => setFormData(p => ({ ...p, slot_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select weekly slot...</option>
                            {slots.map(s => (
                                <option key={s.slot_id} value={s.slot_id}>
                                    Slot #{s.slot_id} &bull; {s.day_name}: {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Reservation Date (YYYY-MM-DD)</label>
                        <input
                            type="date"
                            required
                            value={formData.request_date}
                            onChange={(e) => setFormData(p => ({ ...p, request_date: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Associated Course (Optional)</label>
                        <select
                            value={formData.course_id}
                            onChange={(e) => setFormData(p => ({ ...p, course_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">None / General</option>
                            {courses.map(c => (
                                <option key={c.course_id} value={c.course_id}>{c.course_code} - {c.course_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Purpose / Reason</label>
                        <textarea
                            rows="2"
                            required
                            placeholder="e.g. Supplementary neural network training lab or makeup practical..."
                            value={formData.reason}
                            onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        ></textarea>
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
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
