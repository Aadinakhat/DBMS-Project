import React, { useState, useEffect } from 'react';
import { Database, Bell, ShieldCheck, Check, Server } from 'lucide-react';
import { api } from '../../api/client';

export default function Navbar() {
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [dbStatus, setDbStatus] = useState('ONLINE');

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            if (res.success) {
                setNotifications(res.data);
            }
        } catch {
            setDbStatus('DISCONNECTED');
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const markRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    MySQL 8.0 Engine
                </span>
                <span className="hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    3NF Integrity Enforced
                </span>
            </div>

            <div className="flex items-center space-x-4">
                {/* Health indicator */}
                <div className="flex items-center text-xs text-slate-500 gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Host: localhost:3306</span>
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Database Alert Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifs && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                <span className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                                    Live DB Notifications ({unreadCount} unread)
                                </span>
                                <button
                                    onClick={() => setShowNotifs(false)}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-slate-400">No alerts yet</div>
                                ) : (
                                    notifications.map(n => (
                                        <div
                                            key={n.notification_id}
                                            className={`p-3 text-xs transition-colors flex items-start justify-between gap-2 ${
                                                n.is_read ? 'bg-white text-slate-500' : 'bg-blue-50/50 text-slate-800 font-medium'
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <p className="leading-snug">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">To: {n.user_name}</p>
                                            </div>
                                            {!n.is_read && (
                                                <button
                                                    onClick={() => markRead(n.notification_id)}
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                    title="Mark Read"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile icon */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-xs shadow-sm">
                        AN
                    </div>
                    <div className="hidden md:block text-left">
                        <div className="text-xs font-semibold text-slate-800">Admin Aadi</div>
                        <div className="text-[10px] text-slate-400">DBMS Administrator</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
