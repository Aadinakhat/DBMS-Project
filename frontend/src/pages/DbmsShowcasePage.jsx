import React, { useState, useEffect } from 'react';
import { 
    TerminalSquare, 
    Play, 
    CheckCircle2, 
    Clock, 
    Database, 
    Code2, 
    Sparkles, 
    Layers, 
    FileSpreadsheet,
    Copy,
    Check
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function DbmsShowcasePage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [queries, setQueries] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [runningQueryId, setRunningQueryId] = useState(null);
    const [results, setResults] = useState({});
    const [copiedId, setCopiedId] = useState(null);

    const loadQueries = async () => {
        try {
            setLoading(true);
            const res = await api.get('/dbms/queries');
            if (res.success) {
                setQueries(res.data);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQueries();
    }, []);

    const executeQuery = async (queryId) => {
        try {
            setRunningQueryId(queryId);
            const res = await api.post('/dbms/execute', { queryId });
            if (res.success) {
                setResults(prev => ({ ...prev, [queryId]: res.data }));
                toast.success(`Executed in ${res.data.executionTimeMs}ms with ${res.data.rowCount} rows`);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setRunningQueryId(null);
        }
    };

    const copySql = (id, sql) => {
        navigator.clipboard.writeText(sql);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        toast.info('SQL query copied to clipboard');
    };

    const categories = [
        'ALL',
        'JOIN',
        'VIEW',
        'SUBQUERY',
        'DIVISION',
        'AGGREGATE',
        'PROCEDURE',
        'FUNCTION',
        'TRIGGER'
    ];

    const filteredQueries = queries.filter(q => {
        if (selectedCategory === 'ALL') return true;
        const upper = (q.concept + ' ' + q.name).toUpperCase();
        return upper.includes(selectedCategory);
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            CORE VIVA EXAM SHOWCASE
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Database Management Systems Concepts Console</h1>
                        <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                            Every query runs raw, parameterized SQL directly on the MySQL 8 server without an ORM. Inspect the theoretical concepts, syntax, and live database response.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
                            <div className="text-xl font-black text-amber-400">{queries.length}</div>
                            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Showcase Queries</div>
                        </div>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-700/60">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                selectedCategory === cat
                                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Queries List */}
            {loading ? (
                <LoadingSkeleton rows={6} cols={2} />
            ) : (
                <div className="space-y-6">
                    {filteredQueries.map((q) => {
                        const isRunning = runningQueryId === q.id;
                        const result = results[q.id];

                        return (
                            <div 
                                key={q.id}
                                className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:border-slate-300"
                            >
                                {/* Card Header */}
                                <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                                                {q.concept}
                                            </span>
                                            <h2 className="text-sm font-bold text-slate-900">{q.name}</h2>
                                        </div>
                                        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                                            {q.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => copySql(q.id, q.sql)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                                            title="Copy SQL"
                                        >
                                            {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                            <span className="hidden sm:inline">Copy</span>
                                        </button>
                                        <button
                                            onClick={() => executeQuery(q.id)}
                                            disabled={isRunning}
                                            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                        >
                                            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                                            {isRunning ? 'Executing...' : 'Run Query'}
                                        </button>
                                    </div>
                                </div>

                                {/* SQL Code Block */}
                                <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed border-b border-slate-800">
                                    <pre className="text-emerald-400 select-all whitespace-pre-wrap">{q.sql}</pre>
                                </div>

                                {/* Results View */}
                                {result && (
                                    <div className="p-4 bg-white space-y-3">
                                        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-slate-800">Execution Result:</span>
                                                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    {result.rowCount} row(s) returned
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                {result.executionTimeMs} ms
                                            </span>
                                        </div>

                                        {result.rowCount === 0 ? (
                                            <div className="text-xs text-slate-400 py-3 text-center italic">
                                                Query completed successfully. Empty result set (0 rows).
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-64 overflow-y-auto">
                                                <table className="w-full text-left text-xs border-collapse">
                                                    <thead className="sticky top-0 bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                                        <tr>
                                                            {result.columns.map((col, idx) => (
                                                                <th key={idx} className="py-2 px-3 whitespace-nowrap font-mono text-[11px]">
                                                                    {col}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {result.rows.map((row, rIdx) => (
                                                            <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                                                                {result.columns.map((col, cIdx) => (
                                                                    <td key={cIdx} className="py-2 px-3 whitespace-nowrap font-mono text-[11px] text-slate-700">
                                                                        {row[col] !== null && row[col] !== undefined
                                                                            ? String(row[col])
                                                                            : <span className="text-slate-300 italic">NULL</span>}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
