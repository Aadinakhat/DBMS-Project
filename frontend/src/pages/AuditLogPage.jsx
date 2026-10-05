import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, Filter, ShieldCheck, Database } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function AuditLogPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [actionFilter, setActionFilter] = useState('');

    const loadLogs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/audit-logs', { action_type: actionFilter });
            if (res.success) setLogs(res.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, [actionFilter]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Database Triggers & Audit Trail</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Append-only audit trail automatically recorded by MySQL <code>AFTER INSERT</code> triggers and stored procedures
                    </p>
                </div>
                <button
                    onClick={loadLogs}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto"
                >
                    <RefreshCw className="w-4 h-4 text-slate-600" />
                    Refresh Logs
                </button>
            </div>

            {/* Invariant Banner */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                    <strong>Auditing Invariant:</strong> The application does NOT manually write these records into the log. Instead, database triggers like <code>trg_schedule_after_insert_audit</code> and <code>trg_issue_after_insert_workstation</code> execute within MySQL server engine space, ensuring zero untracked modifications.
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                    >
                        <option value="">All Audit Action Types</option>
                        <option value="SCHEDULE_CREATED">SCHEDULE_CREATED (Trigger)</option>
                        <option value="ISSUE_REPORTED">ISSUE_REPORTED (Trigger)</option>
                        <option value="ADHOC_APPROVED">ADHOC_APPROVED (SP / Trigger)</option>
                        <option value="SEATS_ALLOCATED">SEATS_ALLOCATED (SP)</option>
                        <option value="DATABASE_INITIALIZED">DATABASE_INITIALIZED</option>
                    </select>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-semibold text-slate-800">{logs.length}</span> audit events
                </span>
            </div>

            {/* Table */}
            {loading ? (
                <LoadingSkeleton rows={6} cols={5} />
            ) : logs.length === 0 ? (
                <EmptyState
                    icon={Activity}
                    title="No audit log records found"
                    description="Perform actions in Master Timetable, Issues, or Ad-Hoc to trigger audit events."
                />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Log #</th>
                                    <th className="py-3 px-4">Event Type</th>
                                    <th className="py-3 px-4">Entity</th>
                                    <th className="py-3 px-4">Details & Event Payload</th>
                                    <th className="py-3 px-4">Performed By</th>
                                    <th className="py-3 px-4 text-right">Server Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                                {logs.map((log) => (
                                    <tr key={log.log_id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 px-4 font-bold text-slate-400">
                                            #{log.log_id}
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                log.action_type.includes('SCHEDULE') ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                                                log.action_type.includes('ISSUE') ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                log.action_type.includes('ADHOC') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                'bg-purple-50 text-purple-700 border border-purple-200'
                                            }`}>
                                                {log.action_type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-slate-800 font-sans whitespace-nowrap">
                                            {log.entity_name} (ID: {log.entity_id})
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 font-sans max-w-md">
                                            {log.details}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600 font-sans whitespace-nowrap">
                                            {log.performed_by}
                                        </td>
                                        <td className="py-3 px-4 text-right text-slate-500 text-[11px] whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
