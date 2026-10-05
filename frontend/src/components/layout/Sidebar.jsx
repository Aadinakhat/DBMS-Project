import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    CalendarDays, 
    Cpu, 
    Clock, 
    Code2, 
    GraduationCap, 
    AlertCircle, 
    Activity, 
    Network,
    TerminalSquare
} from 'lucide-react';

const navItems = [
    { to: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
    { to: '/schedules', label: 'Master Timetable', icon: CalendarDays },
    { to: '/labs', label: 'Labs & Workstations', icon: Cpu },
    { to: '/ad-hoc', label: 'Ad-Hoc Bookings', icon: Clock },
    { to: '/dbms-showcase', label: 'DBMS Concepts Showcase', icon: TerminalSquare, highlight: true },
    { to: '/student-timetable', label: 'Student Timetable View', icon: GraduationCap },
    { to: '/issues', label: 'Defect Tracker', icon: AlertCircle },
    { to: '/audit-log', label: 'Triggers & Audit Log', icon: Activity },
    { to: '/schema', label: 'ER Diagram & Schema', icon: Network },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen">
            {/* Header Brand */}
            <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800/80 gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                    <Cpu className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-white tracking-wide leading-tight">LAB ALLOCATOR</h1>
                    <p className="text-[10px] text-blue-400 font-medium">DBMS College System</p>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Main Navigation
                </div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all
                                ${isActive 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold' 
                                    : item.highlight
                                        ? 'text-amber-300 hover:bg-slate-800/80 hover:text-amber-200 border border-amber-500/20 bg-amber-500/5'
                                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 shrink-0 ${item.highlight ? 'text-amber-400' : ''}`} />
                            <span className="flex-1">{item.label}</span>
                            {item.highlight && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    VIVA
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom info footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-center">
                <div className="text-[11px] text-slate-400 font-medium">MySQL 8.0 &bull; Raw Parameterized SQL</div>
                <div className="text-[10px] text-slate-600 mt-0.5">ACID Transactions &bull; 3NF Relational</div>
            </div>
        </aside>
    );
}
