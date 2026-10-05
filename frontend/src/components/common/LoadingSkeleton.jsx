import React from 'react';

export default function LoadingSkeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="w-full space-y-4 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
                <div className="p-4 space-y-3">
                    {Array.from({ length: rows }).map((_, rIdx) => (
                        <div key={rIdx} className="flex gap-4 items-center">
                            {Array.from({ length: cols }).map((_, cIdx) => (
                                <div
                                    key={cIdx}
                                    className="h-6 bg-slate-100 rounded"
                                    style={{ width: `${Math.max(20, 100 / cols - 5)}%` }}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
