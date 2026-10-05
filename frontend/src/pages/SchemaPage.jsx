import React from 'react';
import { Network, Database, ShieldCheck, Key, FileCode } from 'lucide-react';

const tablesList = [
    { name: 'department', pk: 'dept_id', fks: 'None', role: 'Academic departments (Computer, IT, AI)' },
    { name: 'app_user', pk: 'user_id', fks: 'dept_id -> department', role: 'System actors with role ENUM(ADMIN, FACULTY, STUDENT)' },
    { name: 'batch', pk: 'batch_id', fks: 'dept_id -> department', role: 'Student batches with UNIQUE(dept_id, batch_name)' },
    { name: 'student_batch', pk: 'student_id', fks: 'student_id -> app_user, batch_id -> batch', role: 'Student-to-batch partition (1-to-N)' },
    { name: 'course', pk: 'course_id', fks: 'dept_id -> department', role: 'Curriculum courses with UNIQUE course_code' },
    { name: 'lab', pk: 'lab_id', fks: 'None', role: 'Computing venues with CHECK(capacity > 0)' },
    { name: 'operating_system', pk: 'os_id', fks: 'None', role: 'Atomic OS catalog for 1NF decomposition' },
    { name: 'lab_os', pk: '(lab_id, os_id)', fks: 'lab_id -> lab, os_id -> operating_system', role: 'M:N bridge for lab operating systems' },
    { name: 'software', pk: 'software_id', fks: 'None', role: 'Atomic software package catalog' },
    { name: 'lab_software', pk: '(lab_id, software_id)', fks: 'lab_id -> lab, software_id -> software', role: 'M:N bridge for installed lab software' },
    { name: 'course_software', pk: '(course_id, software_id)', fks: 'course_id -> course, software_id -> software', role: 'Course software prerequisites (Relational Division)' },
    { name: 'workstation', pk: 'workstation_id', fks: 'lab_id -> lab', role: 'Individual PCs with UNIQUE(lab_id, station_number)' },
    { name: 'time_slot', pk: 'slot_id', fks: 'None', role: 'Weekly timetable slots with CHECK(end_time > start_time)' },
    { name: 'schedule', pk: 'schedule_id', fks: 'course_id, faculty_id, lab_id, slot_id, batch_id', role: 'Master timetable with 3 UNIQUE conflict guard keys' },
    { name: 'workstation_allocation', pk: '(schedule_id, student_id)', fks: 'schedule_id, student_id, workstation_id', role: 'Seat assignment with UNIQUE(schedule_id, workstation_id)' },
    { name: 'ad_hoc_request', pk: 'request_id', fks: 'faculty_id, lab_id, slot_id, course_id, reviewed_by', role: 'On-demand slots with ACID stored procedure approval' },
    { name: 'issue_report', pk: 'issue_id', fks: 'reported_by, workstation_id', role: 'Hardware defect tracker; trigger flips station to FAULTY' },
    { name: 'notification', pk: 'notification_id', fks: 'user_id -> app_user', role: 'Real-time student & faculty notifications' },
    { name: 'audit_log', pk: 'log_id', fks: 'None', role: 'Append-only audit trail populated by DB triggers' }
];

export default function SchemaPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Database Schema & 3NF Architecture</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Relational blueprint, foreign key constraints, normalization proofs, and ACID guarantees
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        19 Normalized Tables
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Zero Redundancy (3NF)
                    </span>
                </div>
            </div>

            {/* Normalization Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        1NF (Atomic Attributes)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Multi-valued fields (e.g. <code>os_installed</code> and <code>software</code>) were extracted into discrete entities and associative bridge tables (<code>lab_os</code>, <code>lab_software</code>, <code>course_software</code>).
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        2NF (No Partial Dependencies)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Every non-prime attribute in composite primary key relations (such as <code>workstation_allocation</code> and <code>lab_software</code>) is fully functionally dependent on the entire composite key.
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        3NF (No Transitive Dependencies)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Non-prime attributes depend only on primary candidate keys. Derived fields like <code>system_count</code> were intentionally eliminated to prevent update anomalies.
                    </p>
                </div>
            </div>

            {/* Entity Relationship Diagram Structure */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-blue-600" />
                        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Entity-Relationship Architectural Graph
                        </h2>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Chen & Crow's Foot Notation</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <pre className="text-blue-300">{`
DEPARTMENT (1) ────< APP_USER (N) [Faculty, Students, Admins]
DEPARTMENT (1) ────< BATCH (N) ────< STUDENT_BATCH (1:N)
DEPARTMENT (1) ────< COURSE (N) ───< COURSE_SOFTWARE (M:N) >─── SOFTWARE (1)
                                                                    ▲
LAB (1) ───────────< LAB_SOFTWARE (M:N) ────────────────────────────┘
LAB (1) ───────────< LAB_OS (M:N) >─── OPERATING_SYSTEM (1)
LAB (1) ───────────< WORKSTATION (N) ───< ISSUE_REPORT (N)
LAB (1) ───────────< SCHEDULE (N) >─── TIME_SLOT (1)
                        │
                        └───< WORKSTATION_ALLOCATION (1 seat per student per session)

APP_USER (1) ──────< AD_HOC_REQUEST (N) >─── LAB (1) & TIME_SLOT (1)
                    [Guarded by Stored Procedure & trg_adhoc_before_approve]
`}</pre>
                </div>
            </div>

            {/* Relational Table Dictionary */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-600" />
                        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Relational Table Dictionary (MySQL 8.0 InnoDB)
                        </h2>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">19 Base Tables</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                                <th className="py-2.5 px-4">Relation Name</th>
                                <th className="py-2.5 px-4">Primary Key</th>
                                <th className="py-2.5 px-4">Foreign Keys & Cascades</th>
                                <th className="py-2.5 px-4">Design Role & Key Constraints</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                            {tablesList.map((t, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-2.5 px-4 font-bold text-blue-700">
                                        {t.name}
                                    </td>
                                    <td className="py-2.5 px-4 font-bold text-amber-700">
                                        {t.pk}
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-600">
                                        {t.fks}
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-700 font-sans">
                                        {t.role}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
