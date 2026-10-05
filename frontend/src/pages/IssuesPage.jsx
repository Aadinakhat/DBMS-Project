import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, CheckCircle, Wrench, Clock, Check, Filter } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function IssuesPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [issues, setIssues] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    // Catalogs for creating issue
    const [users, setUsers] = useState([]);
    const [labs, setLabs] = useState([]);
    const [selectedLabId, setSelectedLabId] = useState('');
    const [workstations, setWorkstations] = useState([]);

    // Create Modal
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        reported_by: '',
        workstation_id: '',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const loadIssues = async () => {
        try {
            setLoading(true);
            const res = await api.get('/issues', { status: statusFilter });
            if (res.success) setIssues(res.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCatalogs = async () => {
        try {
            const [uRes, lRes] = await Promise.all([
                api.get('/users'),
                api.get('/labs')
            ]);
            if (uRes.success) setUsers(uRes.data);
            if (lRes.success) setLabs(lRes.data);
        } catch (err) {
            console.error('Catalogs error:', err);
        }
    };

    useEffect(() => {
        loadIssues();
    }, [statusFilter]);

    useEffect(() => {
        loadCatalogs();
    }, []);

    useEffect(() => {
        if (selectedLabId) {
            api.get('/workstations', { lab_id: selectedLabId })
                .then(res => {
                    if (res.success) setWorkstations(res.data);
                })
                .catch(err => console.error(err));
        } else {
            setWorkstations([]);
        }
    }, [selectedLabId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const res = await api.post('/issues', formData);
            if (res.success) {
                toast.success(res.message);
                setIsAddOpen(false);
                setFormData({ reported_by: '', workstation_id: '', description: '' });
                setSelectedLabId('');
                loadIssues();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (issueId, newStatus) => {
        try {
            const res = await api.put(`/issues/${issueId}/status`, { status: newStatus });
            if (res.success) {
                toast.success(res.message);
                loadIssues();
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Workstation Defect Tracker</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Fires Database Trigger <code>trg_issue_after_insert_workstation</code> to set workstation state to <code>FAULTY</code>
                    </p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Report Hardware Issue
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
                        <option value="">All Defect Statuses</option>
                        <option value="OPEN">OPEN Tickets</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                    </select>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-semibold text-slate-800">{issues.length}</span> tickets
                </span>
            </div>

            {/* Table */}
            {loading ? (
                <LoadingSkeleton rows={5} cols={5} />
            ) : issues.length === 0 ? (
                <EmptyState
                    icon={AlertCircle}
                    title="No open hardware issues reported"
                    description="All lab workstation terminals are currently operational."
                />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Ticket #</th>
                                    <th className="py-3 px-4">Terminal Location</th>
                                    <th className="py-3 px-4">Defect Description</th>
                                    <th className="py-3 px-4">Reported By</th>
                                    <th className="py-3 px-4">Timestamp</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {issues.map((i) => (
                                    <tr key={i.issue_id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">
                                            #{i.issue_id}
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                                            <div>{i.lab_name}</div>
                                            <span className="text-[11px] font-mono text-blue-600 font-normal">
                                                Workstation #{i.station_number} (ID:{i.workstation_id})
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 max-w-sm">
                                            {i.description}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                                            {i.reporter_name}
                                        </td>
                                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                                            {new Date(i.reported_at).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                i.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                i.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                'bg-rose-50 text-rose-700 border border-rose-200'
                                            }`}>
                                                {i.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            {i.status !== 'RESOLVED' ? (
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {i.status === 'OPEN' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(i.issue_id, 'IN_PROGRESS')}
                                                            className="px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded text-[11px] font-medium"
                                                        >
                                                            In Progress
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleUpdateStatus(i.issue_id, 'RESOLVED')}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Resolve
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-slate-400">Terminal Restored</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Report Issue Modal */}
            <Modal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Log Workstation Defect (Fires Trigger)"
                maxWidth="max-w-md"
            >
                <form onSubmit={handleCreate} className="space-y-4 text-xs">
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px]">
                        <strong>Database Trigger Demo:</strong> When you submit this ticket, <code>trg_issue_after_insert_workstation</code> executes immediately on the server, switching the affected workstation status to <code>FAULTY</code> and appending an entry to <code>audit_log</code>.
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Reported By</label>
                        <select
                            required
                            value={formData.reported_by}
                            onChange={(e) => setFormData(p => ({ ...p, reported_by: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select reporter...</option>
                            {users.map(u => (
                                <option key={u.user_id} value={u.user_id}>
                                    {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Laboratory Venue</label>
                        <select
                            required
                            value={selectedLabId}
                            onChange={(e) => {
                                setSelectedLabId(e.target.value);
                                setFormData(p => ({ ...p, workstation_id: '' }));
                            }}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Select laboratory first...</option>
                            {labs.map(l => (
                                <option key={l.lab_id} value={l.lab_id}>{l.lab_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Workstation Terminal</label>
                        <select
                            required
                            disabled={!selectedLabId}
                            value={formData.workstation_id}
                            onChange={(e) => setFormData(p => ({ ...p, workstation_id: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
                        >
                            <option value="">Select workstation terminal...</option>
                            {workstations.map(w => (
                                <option key={w.workstation_id} value={w.workstation_id}>
                                    Station #{w.station_number} (Currently: {w.status})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Defect Description</label>
                        <textarea
                            rows="2"
                            required
                            placeholder="e.g. HDMI cable broken, monitor display flickering or system won't boot..."
                            value={formData.description}
                            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
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
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm"
                        >
                            {submitting ? 'Submitting...' : 'Log Defect (Fires Trigger)'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
