import React, { useState, useEffect, useMemo } from 'react';
import { 
    CalendarDays, 
    Plus, 
    Search, 
    Trash2, 
    Users, 
    Armchair, 
    Clock, 
    RotateCcw, 
    Building2, 
    UserCheck, 
    Coffee, 
    UtensilsCrossed,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Sparkles,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

// Weekdays supported by college timetable
const DAYS = [
    { day_of_week: 1, name: 'Monday', short: 'Mon' },
    { day_of_week: 2, name: 'Tuesday', short: 'Tue' },
    { day_of_week: 3, name: 'Wednesday', short: 'Wed' },
    { day_of_week: 4, name: 'Thursday', short: 'Thu' },
    { day_of_week: 5, name: 'Friday', short: 'Fri' },
];

// Chronological academic periods and database-verified break intervals
const PERIOD_ROWS = [
    { id: 'p1', type: 'session', label: 'Period 1', startTime: '09:00:00', endTime: '10:00:00', display: '09:00 - 10:00' },
    { id: 'p2', type: 'session', label: 'Period 2', startTime: '10:00:00', endTime: '11:00:00', display: '10:00 - 11:00' },
    { id: 'b1', type: 'break', label: 'Morning Tea / Recess', startTime: '11:00:00', endTime: '11:15:00', display: '11:00 - 11:15', icon: Coffee },
    { id: 'p3', type: 'session', label: 'Period 3', startTime: '11:15:00', endTime: '12:15:00', display: '11:15 - 12:15' },
    { id: 'p4', type: 'session', label: 'Period 4', startTime: '12:15:00', endTime: '13:15:00', display: '12:15 - 13:15' },
    { id: 'b2', type: 'break', label: 'Institutional Lunch Break', startTime: '13:15:00', endTime: '14:15:00', display: '13:15 - 14:15', icon: UtensilsCrossed },
    { id: 'p5', type: 'session', label: 'Period 5', startTime: '14:15:00', endTime: '15:15:00', display: '14:15 - 15:15' },
    { id: 'p6', type: 'session', label: 'Period 6', startTime: '15:15:00', endTime: '16:15:00', display: '15:15 - 16:15' },
    { id: 'p7', type: 'session', label: 'Period 7', startTime: '16:15:00', endTime: '17:15:00', display: '16:15 - 17:15' },
    { id: 'p8', type: 'session', label: 'Period 8', startTime: '17:15:00', endTime: '18:15:00', display: '17:15 - 18:15' },
];

export default function SchedulesPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState([]);
    
    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        day_of_week: '',
        lab_id: '',
        faculty_id: '',
        batch_id: '',
        session_type: ''
    });

    // Catalogs for creating schedule and filtering
    const [courses, setCourses] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [labs, setLabs] = useState([]);
    const [slots, setSlots] = useState([]);
    const [batches, setBatches] = useState([]);

    // Add Session Modal
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

    // Live Database Availability State (Location slots queried for selected Time Slot)
    const [availableLabs, setAvailableLabs] = useState([]);
    const [loadingAvailableLabs, setLoadingAvailableLabs] = useState(false);
    const [availabilityMeta, setAvailabilityMeta] = useState(null);
    const [showOccupiedDetails, setShowOccupiedDetails] = useState(false);

    // Group time slots by weekday for clean UI dropdown
    const groupedSlots = useMemo(() => {
        const groups = {};
        for (const day of DAYS) {
            groups[day.day_of_week] = {
                dayName: day.name,
                slots: []
            };
        }
        for (const s of slots) {
            if (groups[s.day_of_week]) {
                groups[s.day_of_week].slots.push(s);
            }
        }
        return groups;
    }, [slots]);

    // Live query to database for available locations when a time slot is selected
    const handleSlotChange = async (slotId) => {
        const slotVal = slotId ? String(slotId) : '';
        setFormData(p => ({ ...p, slot_id: slotVal, lab_id: '' }));
        setShowOccupiedDetails(false);

        if (!slotVal) {
            setAvailableLabs([]);
            setAvailabilityMeta(null);
            return;
        }

        try {
            setLoadingAvailableLabs(true);
            const res = await api.get('/labs/available', { slot_id: slotVal });
            if (res.success) {
                setAvailableLabs(res.data || []);
                setAvailabilityMeta(res.meta || null);
            }
        } catch (err) {
            toast.error(`Database query failed: ${err.message}`);
            setAvailableLabs([]);
            setAvailabilityMeta(null);
        } finally {
            setLoadingAvailableLabs(false);
        }
    };

    // Open Add Session modal with optional pre-selected slot
    const handleOpenAddModal = (presetSlotId = null) => {
        const slotIdToUse = presetSlotId ? String(presetSlotId) : '';
        setFormData({
            course_id: '',
            faculty_id: '',
            lab_id: '',
            slot_id: slotIdToUse,
            batch_id: '',
            session_type: 'PRACTICAL'
        });
        setShowOccupiedDetails(false);
        setIsAddOpen(true);

        if (slotIdToUse) {
            handleSlotChange(slotIdToUse);
        } else {
            setAvailableLabs([]);
            setAvailabilityMeta(null);
        }
    };

    const handleCloseAddModal = () => {
        setIsAddOpen(false);
        setAvailableLabs([]);
        setAvailabilityMeta(null);
        setShowOccupiedDetails(false);
    };

    // Delete confirmation
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Seat Allocations viewer modal
    const [viewSchedule, setViewSchedule] = useState(null);
    const [allocations, setAllocations] = useState([]);
    const [loadingAllocations, setLoadingAllocations] = useState(false);

    // Fetch schedules from backend with high limit to capture full timetable matrix
    const loadData = async () => {
        try {
            setLoading(true);
            const queryParams = {
                limit: 1000
            };
            if (filters.search) queryParams.search = filters.search;
            if (filters.day_of_week) queryParams.day_of_week = filters.day_of_week;
            if (filters.lab_id) queryParams.lab_id = filters.lab_id;
            if (filters.faculty_id) queryParams.faculty_id = filters.faculty_id;
            if (filters.batch_id) queryParams.batch_id = filters.batch_id;

            const res = await api.get('/schedules', queryParams);
            if (res.success) {
                setSchedules(res.data);
            }
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
    }, [filters.day_of_week, filters.lab_id, filters.faculty_id, filters.batch_id]);

    useEffect(() => {
        loadCatalogs();
    }, []);

    // Filter by session_type on the client if specified
    const filteredSchedules = useMemo(() => {
        if (!filters.session_type) return schedules;
        return schedules.filter(s => s.session_type === filters.session_type);
    }, [schedules, filters.session_type]);

    const handleResetFilters = () => {
        setFilters({
            search: '',
            day_of_week: '',
            lab_id: '',
            faculty_id: '',
            batch_id: '',
            session_type: ''
        });
    };

    const hasActiveFilters = Boolean(
        filters.search || 
        filters.day_of_week || 
        filters.lab_id || 
        filters.faculty_id || 
        filters.batch_id || 
        filters.session_type
    );

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const res = await api.post('/schedules', formData);
            if (res.success) {
                toast.success('Session scheduled successfully. Constraint checks passed and audit log updated.');
                handleCloseAddModal();
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
                setAllocations(res.data.allocations || []);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoadingAllocations(false);
        }
    };

    // Helper for badge colors
    const getTypeBadgeClass = (type) => {
        switch (type) {
            case 'EXAM':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'MAKEUP':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'PRACTICAL':
            default:
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
    };

    // Visible days (filtered or full Monday-Friday)
    const visibleDays = useMemo(() => {
        if (!filters.day_of_week) return DAYS;
        return DAYS.filter(d => d.day_of_week === parseInt(filters.day_of_week, 10));
    }, [filters.day_of_week]);

    // Lookup map to quickly access sessions for a day and period
    const cellMap = useMemo(() => {
        const map = {};
        for (const day of DAYS) {
            for (const period of PERIOD_ROWS) {
                if (period.type === 'break') continue;
                const key = `${day.day_of_week}_${period.id}`;
                map[key] = {
                    starting: [],
                    continuing: []
                };
            }
        }

        for (const s of filteredSchedules) {
            // Find period where this session starts
            const startPeriod = PERIOD_ROWS.find(
                p => p.type === 'session' && (p.startTime === s.start_time || (s.start_time >= p.startTime && s.start_time < p.endTime))
            );

            if (startPeriod) {
                const startKey = `${s.day_of_week}_${startPeriod.id}`;
                if (map[startKey]) {
                    map[startKey].starting.push(s);
                }

                // Check subsequent periods where this session is ongoing
                PERIOD_ROWS.forEach(p => {
                    if (p.type === 'session' && p.id !== startPeriod.id) {
                        if (s.start_time < p.startTime && s.end_time >= p.endTime) {
                            const contKey = `${s.day_of_week}_${p.id}`;
                            if (map[contKey]) {
                                map[contKey].continuing.push(s);
                            }
                        }
                    }
                });
            }
        }

        return map;
    }, [filteredSchedules]);

    return (
        <div className="space-y-5">
            {/* Institution Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <div className="text-[11px] font-semibold text-blue-600 tracking-wide uppercase">
                        Sardar Patel Institute of Technology — Computer Engineering Department
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                        Master Timetable
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Weekly laboratory & classroom allocation matrix &bull; Database conflict prevention invariants enforced
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenAddModal()}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors self-start md:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Add Session
                    </button>
                </div>
            </div>

            {/* Timetable Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-4 bg-white rounded-xl border border-slate-200 shadow-xs text-xs">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                        Session Legend:
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="font-medium text-[11px] text-slate-600">Practical Lab (2h)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <span className="font-medium text-[11px] text-slate-600">Laboratory Exam</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="font-medium text-[11px] text-slate-600">Makeup / Tutorial</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-slate-300"></span>
                        <span className="font-medium text-[11px] text-slate-600">Institutional Break</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold">↳</span>
                        <span className="font-medium text-[11px] text-slate-600">Continuing Slot (2h session)</span>
                    </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500">
                    Total Loaded: <strong className="text-slate-800">{filteredSchedules.length}</strong> sessions
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center gap-2.5 justify-between">
                    <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[190px]">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search course, lab, faculty, batch..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && loadData()}
                                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        {/* Day of Week */}
                        <select
                            value={filters.day_of_week}
                            onChange={(e) => setFilters(prev => ({ ...prev, day_of_week: e.target.value }))}
                            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                        >
                            <option value="">All Days (Mon - Fri)</option>
                            <option value="1">Monday Only</option>
                            <option value="2">Tuesday Only</option>
                            <option value="3">Wednesday Only</option>
                            <option value="4">Thursday Only</option>
                            <option value="5">Friday Only</option>
                        </select>

                        {/* Lab filter */}
                        <select
                            value={filters.lab_id}
                            onChange={(e) => setFilters(prev => ({ ...prev, lab_id: e.target.value }))}
                            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 max-w-[180px] truncate"
                        >
                            <option value="">All Laboratories ({labs.length})</option>
                            {labs.map(l => (
                                <option key={l.lab_id} value={l.lab_id}>{l.lab_name}</option>
                            ))}
                        </select>

                        {/* Batch filter */}
                        <select
                            value={filters.batch_id}
                            onChange={(e) => setFilters(prev => ({ ...prev, batch_id: e.target.value }))}
                            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 max-w-[150px] truncate"
                        >
                            <option value="">All Batches ({batches.length})</option>
                            {batches.map(b => (
                                <option key={b.batch_id} value={b.batch_id}>{b.batch_name}</option>
                            ))}
                        </select>

                        {/* Faculty filter */}
                        <select
                            value={filters.faculty_id}
                            onChange={(e) => setFilters(prev => ({ ...prev, faculty_id: e.target.value }))}
                            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 max-w-[160px] truncate"
                        >
                            <option value="">All Faculty ({facultyList.length})</option>
                            {facultyList.map(f => (
                                <option key={f.user_id} value={f.user_id}>{f.name}</option>
                            ))}
                        </select>

                        {/* Session Type */}
                        <select
                            value={filters.session_type}
                            onChange={(e) => setFilters(prev => ({ ...prev, session_type: e.target.value }))}
                            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                        >
                            <option value="">All Types</option>
                            <option value="PRACTICAL">Practical Only</option>
                            <option value="EXAM">Exam Only</option>
                            <option value="MAKEUP">Makeup Only</option>
                        </select>

                        <button
                            onClick={loadData}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                            Apply
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={handleResetFilters}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Reset
                            </button>
                        )}
                    </div>

                    <div className="text-xs text-slate-500">
                        Showing <strong className="text-slate-800">{filteredSchedules.length}</strong> matching entries
                    </div>
                </div>
            </div>

            {/* Weekly Timetable Grid */}
            {loading ? (
                <LoadingSkeleton rows={6} cols={6} />
            ) : filteredSchedules.length === 0 ? (
                <EmptyState
                    icon={CalendarDays}
                    title="No scheduled sessions match the selected filters"
                    description="Try resetting your search query, laboratory, or batch filters."
                    action={
                        hasActiveFilters ? (
                            <button
                                onClick={handleResetFilters}
                                className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium"
                            >
                                Reset All Filters
                            </button>
                        ) : (
                            <button
                                onClick={() => handleOpenAddModal()}
                                className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium"
                            >
                                Add First Session
                            </button>
                        )
                    }
                />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto max-h-[750px] overflow-y-auto">
                        <table className="w-full border-collapse text-left min-w-[1000px] table-fixed">
                            {/* Table Header: Weekdays */}
                            <thead>
                                <tr className="bg-slate-100/95 sticky top-0 z-20 border-b border-slate-200 text-slate-700 text-xs font-semibold backdrop-blur-sm">
                                    <th className="w-40 py-3 px-3.5 border-r border-slate-200 sticky left-0 z-30 bg-slate-100 font-bold uppercase tracking-wider text-[11px] text-slate-600">
                                        Time Slot
                                    </th>
                                    {visibleDays.map(day => (
                                        <th key={day.day_of_week} className="py-3 px-4 border-r border-slate-200 last:border-r-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900">{day.name}</span>
                                                <span className="text-[10px] font-mono font-normal text-slate-400">
                                                    Day {day.day_of_week}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* Table Body: Chronological Periods and Breaks */}
                            <tbody className="divide-y divide-slate-200 text-xs">
                                {PERIOD_ROWS.map((period) => {
                                    // Render break interval row spanning across all columns
                                    if (period.type === 'break') {
                                        const BreakIcon = period.icon || Coffee;
                                        return (
                                            <tr key={period.id} className="bg-slate-50/80 border-y border-slate-200/90">
                                                <td className="py-2.5 px-3.5 border-r border-slate-200 sticky left-0 z-10 bg-slate-100/80 font-mono text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{period.display}</span>
                                                    </div>
                                                </td>
                                                <td
                                                    colSpan={visibleDays.length}
                                                    className="py-2 px-4 text-center text-slate-500 font-medium text-xs bg-slate-50/90"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <BreakIcon className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                                                            {period.label}
                                                        </span>
                                                        <span className="text-slate-400 text-[11px]">
                                                            ({period.display}) &bull; No instructional sessions scheduled
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // Render teaching period row
                                    return (
                                        <tr key={period.id} className="hover:bg-slate-50/40 transition-colors">
                                            {/* Time Column (Sticky Left) */}
                                            <td className="w-40 py-3 px-3.5 border-r border-slate-200 sticky left-0 z-10 bg-white font-medium align-top">
                                                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                                    <span>{period.display}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
                                                    {period.label}
                                                </div>
                                            </td>

                                            {/* Day Columns */}
                                            {visibleDays.map((day) => {
                                                const cellData = cellMap[`${day.day_of_week}_${period.id}`] || { starting: [], continuing: [] };
                                                const hasStarting = cellData.starting.length > 0;
                                                const hasContinuing = cellData.continuing.length > 0;
                                                const isEmpty = !hasStarting && !hasContinuing;
                                                const cellSlot = slots.find(
                                                    s => s.day_of_week === day.day_of_week && s.start_time === period.startTime
                                                );

                                                return (
                                                    <td
                                                        key={`${day.day_of_week}_${period.id}`}
                                                        className="py-2 px-2.5 border-r border-slate-200 last:border-r-0 align-top bg-white"
                                                    >
                                                        {isEmpty ? (
                                                            <div 
                                                                onClick={() => cellSlot && handleOpenAddModal(cellSlot.slot_id)}
                                                                className={`h-full min-h-[64px] p-2 flex flex-col items-center justify-center rounded-lg transition-all border border-transparent ${
                                                                    cellSlot ? 'cursor-pointer hover:bg-blue-50/60 hover:border-dashed hover:border-blue-300 group' : 'text-slate-300'
                                                                }`}
                                                                title={cellSlot ? `Click to schedule session for ${day.name} ${period.display}` : undefined}
                                                            >
                                                                <span className={cellSlot ? 'group-hover:hidden select-none text-[11px] text-slate-300' : 'select-none text-[11px] text-slate-300'}>—</span>
                                                                {cellSlot && (
                                                                    <span className="hidden group-hover:inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600">
                                                                        <Plus className="w-3.5 h-3.5" />
                                                                        <span>Add Session</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                                                                {/* Starting Session Cards */}
                                                                {cellData.starting.map((s) => (
                                                                    <div
                                                                        key={s.schedule_id}
                                                                        className="bg-white rounded-lg border border-slate-200 hover:border-blue-400 p-2.5 shadow-xs hover:shadow-sm transition-all text-xs flex flex-col justify-between gap-1.5"
                                                                    >
                                                                        {/* Card Header: Course Code + Session Type Badge + Duration */}
                                                                        <div className="flex items-start justify-between gap-1.5">
                                                                            <div className="min-w-0">
                                                                                <span className="font-bold text-slate-900 tracking-tight block truncate text-xs">
                                                                                    {s.course_code}
                                                                                </span>
                                                                                <span
                                                                                    className="text-[10px] text-slate-500 block truncate leading-tight mt-0.5"
                                                                                    title={s.course_name}
                                                                                >
                                                                                    {s.course_name}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex flex-col items-end shrink-0 gap-0.5">
                                                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${getTypeBadgeClass(s.session_type)}`}>
                                                                                    {s.session_type}
                                                                                </span>
                                                                                <span className="text-[9px] font-mono text-slate-400">
                                                                                    {s.start_time?.substring(0, 5)} - {s.end_time?.substring(0, 5)}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        {/* Card Middle: Lab Venue + Batch */}
                                                                        <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                                                                            <div className="flex items-center gap-1 font-semibold text-slate-800 truncate" title={s.lab_name}>
                                                                                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                                                                <span className="truncate">{s.lab_name}</span>
                                                                            </div>
                                                                            <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0 border border-slate-200">
                                                                                {s.batch_name}
                                                                            </span>
                                                                        </div>

                                                                        {/* Card Bottom: Faculty + Action Buttons */}
                                                                        <div className="flex items-center justify-between gap-1 pt-1 text-[10px] text-slate-600">
                                                                            <div className="flex items-center gap-1 truncate" title={s.faculty_name}>
                                                                                <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                                                                                <span className="truncate">{s.faculty_name}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1 shrink-0">
                                                                                {s.allocated_seats_count > 0 ? (
                                                                                    <button
                                                                                        onClick={() => handleViewAllocations(s)}
                                                                                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-medium transition-colors"
                                                                                        title="View Allocated Workstation Seats"
                                                                                    >
                                                                                        <Armchair className="w-3 h-3 text-blue-600" />
                                                                                        <span>{s.allocated_seats_count} Seats</span>
                                                                                    </button>
                                                                                ) : (
                                                                                    <button
                                                                                        onClick={() => handleAllocateSeats(s.schedule_id)}
                                                                                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-[10px] font-semibold transition-colors"
                                                                                        title="Run Stored Procedure sp_allocate_student_seats"
                                                                                    >
                                                                                        <Users className="w-3 h-3 text-amber-600" />
                                                                                        <span>Allocate</span>
                                                                                    </button>
                                                                                )}
                                                                                <button
                                                                                    onClick={() => setDeleteId(s.schedule_id)}
                                                                                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                                                                                    title="Delete Session"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {/* Continuation Indicators for 2-hour sessions spanning from previous period */}
                                                                {cellData.continuing.map((s) => (
                                                                    <div
                                                                        key={`cont-${s.schedule_id}`}
                                                                        className="bg-slate-50/90 rounded-md border border-dashed border-slate-300 p-1.5 text-[10px] text-slate-600 flex items-center justify-between gap-1 hover:bg-slate-100 transition-colors"
                                                                        title={`${s.course_code} in ${s.lab_name} continues from ${s.start_time?.substring(0, 5)}`}
                                                                    >
                                                                        <div className="flex items-center gap-1 truncate font-medium">
                                                                            <span className="text-blue-500 font-bold">↳</span>
                                                                            <span className="font-semibold text-slate-800">{s.course_code}</span>
                                                                            <span className="text-slate-400 truncate">({s.lab_name} &bull; {s.batch_name})</span>
                                                                        </div>
                                                                        <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                                                            {s.start_time?.substring(0, 5)} - {s.end_time?.substring(0, 5)}
                                                                        </span>
                                                                    </div>
                                                                ))}

                                                                {/* Quick add session button in cell footer */}
                                                                {cellSlot && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleOpenAddModal(cellSlot.slot_id)}
                                                                        className="w-full py-1 px-1.5 rounded border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[10px] text-slate-400 hover:text-blue-600 font-medium flex items-center justify-center gap-1 transition-colors"
                                                                        title={`Schedule another session on ${day.name} at ${period.display}`}
                                                                    >
                                                                        <Plus className="w-3 h-3" />
                                                                        <span>Add Session</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Schedule Modal (Dynamic DB-driven location slot filtering) */}
            <Modal
                isOpen={isAddOpen}
                onClose={handleCloseAddModal}
                title="Schedule New Master Laboratory Session"
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleCreate} className="space-y-4 text-xs">
                    {/* Database Invariant Context Card */}
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-blue-950">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Database Invariant & Dynamic Availability Protection</span>
                        </div>
                        <p className="text-blue-800 leading-relaxed">
                            Selecting a time slot queries MySQL live. <strong>Only verified, unoccupied location slots (laboratories)</strong> are visible in the location selector to guarantee conflict-free scheduling without collision.
                        </p>
                    </div>

                    {/* Step 1: Time Slot Selection (Must be selected first) */}
                    <div className="space-y-1.5">
                        <label className="block font-semibold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-600" />
                                <span>1. Weekly Time Slot</span>
                                <span className="text-rose-500">*</span>
                            </span>
                            {formData.slot_id && availabilityMeta?.slot && (
                                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium border border-blue-200">
                                    {availabilityMeta.slot.day_name} ({availabilityMeta.slot.start_time?.substring(0, 5)} - {availabilityMeta.slot.end_time?.substring(0, 5)})
                                </span>
                            )}
                        </label>
                        <select
                            required
                            value={formData.slot_id}
                            onChange={(e) => handleSlotChange(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-800 text-xs"
                        >
                            <option value="">Select weekly time slot first...</option>
                            {Object.entries(groupedSlots).map(([dayOfWeek, group]) => (
                                <optgroup key={dayOfWeek} label={`📅 ${group.dayName}`}>
                                    {group.slots.map(s => {
                                        const startH = parseInt(s.start_time.split(':')[0], 10);
                                        const endH = parseInt(s.end_time.split(':')[0], 10);
                                        const durationH = endH - startH;
                                        return (
                                            <option key={s.slot_id} value={s.slot_id}>
                                                {group.dayName}: {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)} {durationH >= 2 ? '(2h Practical Session)' : '(1h Single Period)'}
                                            </option>
                                        );
                                    })}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Step 2: Available Location Slot (Laboratory) Selection */}
                    <div className="space-y-1.5">
                        <label className="block font-semibold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>2. Available Location Slot (Laboratory)</span>
                                <span className="text-rose-500">*</span>
                            </span>
                            {formData.slot_id && !loadingAvailableLabs && availabilityMeta && (
                                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {availableLabs.length} available
                                </span>
                            )}
                        </label>

                        {/* Location Select Box */}
                        {loadingAvailableLabs ? (
                            <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-slate-500 text-xs">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                <span>Checking database for available locations...</span>
                            </div>
                        ) : (
                            <select
                                required
                                disabled={!formData.slot_id || availableLabs.length === 0}
                                value={formData.lab_id}
                                onChange={(e) => setFormData(p => ({ ...p, lab_id: e.target.value }))}
                                className={`w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs ${
                                    !formData.slot_id 
                                        ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed' 
                                        : 'bg-slate-50 border-slate-200 font-medium text-slate-800'
                                }`}
                            >
                                {!formData.slot_id ? (
                                    <option value="">⚠️ Select a time slot above first to view available locations...</option>
                                ) : availableLabs.length === 0 ? (
                                    <option value="">No locations available for this time slot</option>
                                ) : (
                                    <>
                                        <option value="">Select available location ({availableLabs.length} available in DB)...</option>
                                        {availableLabs.map(l => (
                                            <option key={l.lab_id} value={l.lab_id}>
                                                {l.lab_name} — Capacity: {l.capacity} {l.gpu_capacity > 0 ? `(GPU: ${l.gpu_capacity})` : ''} {l.active_workstations ? `• ${l.active_workstations} active terminals` : ''}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        )}

                        {/* Live Availability Info Banner & Collision Transparency */}
                        {!formData.slot_id ? (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>Please pick a weekly time slot above to load available rooms from the database.</span>
                            </p>
                        ) : availabilityMeta && (
                            <div className="p-2.5 rounded-lg border bg-slate-50/80 border-slate-200 text-[11px] space-y-1.5 mt-1">
                                <div className="flex items-center justify-between text-slate-700">
                                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Showing {availabilityMeta.availableCount} of {availabilityMeta.totalCount} locations</span>
                                    </div>
                                    {availabilityMeta.occupiedCount > 0 && (
                                        <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                            {availabilityMeta.occupiedCount} occupied hidden
                                        </span>
                                    )}
                                </div>

                                {availabilityMeta.occupiedCount > 0 && (
                                    <div className="pt-1 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => setShowOccupiedDetails(!showOccupiedDetails)}
                                            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 focus:outline-none"
                                        >
                                            {showOccupiedDetails ? (
                                                <>
                                                    <ChevronUp className="w-3 h-3" />
                                                    <span>Hide occupied room details</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-3 h-3" />
                                                    <span>View {availabilityMeta.occupiedCount} booked rooms filtered out by database</span>
                                                </>
                                            )}
                                        </button>

                                        {showOccupiedDetails && (
                                            <div className="mt-1.5 divide-y divide-slate-100 bg-white rounded-md border border-slate-200 max-h-32 overflow-y-auto p-1.5 text-[10px]">
                                                {availabilityMeta.occupiedLabs?.map((occ, idx) => (
                                                    <div key={idx} className="py-1 px-1 flex items-center justify-between text-slate-700">
                                                        <div className="font-semibold truncate pr-2">{occ.lab_name}</div>
                                                        <div className="text-slate-500 font-mono shrink-0">
                                                            {occ.course_code} ({occ.batch_name}) &bull; {occ.start_time?.substring(0, 5)}-{occ.end_time?.substring(0, 5)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Step 3: Course & Session Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                        <div>
                            <label className="block font-medium text-slate-700 mb-1">
                                Course <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.course_id}
                                onChange={(e) => setFormData(p => ({ ...p, course_id: e.target.value }))}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
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
                            <label className="block font-medium text-slate-700 mb-1">
                                Session Type
                            </label>
                            <select
                                value={formData.session_type}
                                onChange={(e) => setFormData(p => ({ ...p, session_type: e.target.value }))}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold text-slate-700"
                            >
                                <option value="PRACTICAL">PRACTICAL (Lab)</option>
                                <option value="EXAM">EXAM (Evaluation)</option>
                                <option value="MAKEUP">MAKEUP (Tutorial)</option>
                            </select>
                        </div>
                    </div>

                    {/* Step 4: Batch & Faculty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-medium text-slate-700 mb-1">
                                Student Batch <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.batch_id}
                                onChange={(e) => setFormData(p => ({ ...p, batch_id: e.target.value }))}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-mono"
                            >
                                <option value="">Select batch...</option>
                                {batches.map(b => (
                                    <option key={b.batch_id} value={b.batch_id}>{b.batch_name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 mb-1">
                                Faculty In-Charge <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.faculty_id}
                                onChange={(e) => setFormData(p => ({ ...p, faculty_id: e.target.value }))}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                            >
                                <option value="">Select professor...</option>
                                {facultyList.map(f => (
                                    <option key={f.user_id} value={f.user_id}>{f.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handleCloseAddModal}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || loadingAvailableLabs || !formData.slot_id || !formData.lab_id}
                            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-sm text-xs transition-all ${
                                submitting || loadingAvailableLabs || !formData.slot_id || !formData.lab_id
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
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
                            Venue: <strong>{viewSchedule?.lab_name}</strong> &bull; Slot: <strong>{viewSchedule?.day_name} {viewSchedule?.start_time?.substring(0, 5)} - {viewSchedule?.end_time?.substring(0, 5)}</strong>
                        </div>
                        {allocations.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-400">
                                No workstation seats allocated yet. Click "Auto-Allocate" to run the stored procedure.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
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
                        )}
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
