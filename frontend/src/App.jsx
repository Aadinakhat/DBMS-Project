import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';

// Pages
import DashboardPage from './pages/DashboardPage';
import SchedulesPage from './pages/SchedulesPage';
import LabsPage from './pages/LabsPage';
import AdHocPage from './pages/AdHocPage';
import DbmsShowcasePage from './pages/DbmsShowcasePage';
import StudentTimetablePage from './pages/StudentTimetablePage';
import IssuesPage from './pages/IssuesPage';
import AuditLogPage from './pages/AuditLogPage';
import SchemaPage from './pages/SchemaPage';

export default function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="schedules" element={<SchedulesPage />} />
                        <Route path="labs" element={<LabsPage />} />
                        <Route path="ad-hoc" element={<AdHocPage />} />
                        <Route path="dbms-showcase" element={<DbmsShowcasePage />} />
                        <Route path="student-timetable" element={<StudentTimetablePage />} />
                        <Route path="issues" element={<IssuesPage />} />
                        <Route path="audit-log" element={<AuditLogPage />} />
                        <Route path="schema" element={<SchemaPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    );
}
