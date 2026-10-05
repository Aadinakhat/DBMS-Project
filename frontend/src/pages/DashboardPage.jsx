import React, { useState, useEffect } from 'react';
import { 
    Cpu, 
    CalendarDays, 
    Clock, 
    AlertCircle, 
    Activity, 
    CheckCircle2, 
    ArrowUpRight, 
    Users,
    HardDrive,
    TerminalSquare
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const res = await api.get('/dashboard/summary');
            if (res.success) {
                setData(res.data);
            }
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading || !data) {
        return <LoadingSkeleton rows={6} cols={3} />;
    }

    const { stats, utilizationData, healthData, deptSessions, recentActivity } = data;

    const statCards = [
        { label: 'Total Laboratories', value: stats.total_labs, icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Installed Workstations', value: stats.total_workstations, icon: HardDrive, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Active Terminals', value: stats.active_workstations, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Faulty Terminals', value: stats.faulty_workstations, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Scheduled Sessions', value: stats.total_schedules, icon: CalendarDays, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'Pending Ad-Hoc Requests', value: stats.pending_adhoc, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Open Hardware Tickets', value: stats.open_issues, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Registered Students', value: stats.total_students, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Dashboard</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Real-time monitoring driven by MySQL 8.0 views, triggers, and relational aggregates
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        to="/dbms-showcase"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors"
                    >
                        <TerminalSquare className="w-3.5 h-3.5" />
                        Run DBMS Showcase (Viva)
                    </Link>
                    <Link
                        to="/schedules"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                    >
                        <CalendarDays className="w-3.5 h-3.5" />
                        View Master Timetable
                    </Link>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((c, i) => {
                    const Icon = c.icon;
                    return (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${c.bg} ${c.color} shrink-0`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-slate-900 leading-none">{c.value}</div>
                                <div className="text-[11px] font-medium text-slate-500 mt-1">{c.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Lab Utilization (from view vw_lab_utilization) */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Weekly Laboratory Utilization (%)
                            </h2>
                            <p className="text-[11px] text-slate-400">Queried dynamically from Database View: vw_lab_utilization</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            VIEW
                        </span>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={utilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="lab_name" 
                                    tick={{ fontSize: 10, fill: '#64748b' }} 
                                    angle={-15} 
                                    textAnchor="end"
                                />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                                <Tooltip 
                                    formatter={(val) => [`${val}%`, 'Utilization']}
                                    contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="utilization_percentage" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                    {utilizationData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.utilization_percentage > 40 ? '#2563eb' : '#60a5fa'} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Department Sessions */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Scheduled Sessions by Department
                            </h2>
                            <p className="text-[11px] text-slate-400">Aggregated via multi-table INNER & LEFT JOINs</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            AGGREGATE
                        </span>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptSessions} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="dept_name" 
                                    tick={{ fontSize: 10, fill: '#64748b' }} 
                                    angle={-15} 
                                    textAnchor="end"
                                />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                                <Tooltip 
                                    formatter={(val) => [`${val} sessions`, 'Workload']}
                                    contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="session_count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Hardware Health & Audit Trail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lab Hardware Status (from vw_lab_health_status) */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Lab Terminal Operational Readiness
                        </h2>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            vw_lab_health_status
                        </span>
                    </div>
                    <div className="space-y-3">
                        {healthData.map((lab) => (
                            <div key={lab.lab_id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-semibold text-slate-800">{lab.lab_name}</span>
                                    <span className="font-medium text-slate-600">
                                        {lab.active_workstations} / {lab.total_workstations} active ({lab.usable_percentage || 0}%)
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                                    <div 
                                        className="bg-emerald-500 h-full transition-all"
                                        style={{ width: `${lab.usable_percentage || 0}%` }}
                                    ></div>
                                    <div 
                                        className="bg-rose-500 h-full transition-all"
                                        style={{ width: `${lab.total_workstations ? (lab.faulty_workstations / lab.total_workstations) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Trigger Audit Activity */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-600" />
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Live Database Trigger Audit Trail
                            </h2>
                        </div>
                        <Link to="/audit-log" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                            View All <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-2.5">
                        {recentActivity.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No audit records logged yet</p>
                        ) : (
                            recentActivity.map((log) => (
                                <div key={log.log_id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-start gap-2.5 text-xs">
                                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase shrink-0 mt-0.5">
                                        {log.action_type}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-800 font-medium truncate">{log.details}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            By {log.performed_by} &bull; {new Date(log.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
