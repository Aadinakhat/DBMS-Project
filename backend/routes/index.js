const express = require('express');
const router = express.Router();
const db = require('../db');

const dashboardController = require('../controllers/dashboardController');
const scheduleController = require('../controllers/scheduleController');
const labController = require('../controllers/labController');
const workstationController = require('../controllers/workstationController');
const adHocController = require('../controllers/adHocController');
const courseController = require('../controllers/courseController');
const userController = require('../controllers/userController');
const batchController = require('../controllers/batchController');
const issueController = require('../controllers/issueController');
const auditController = require('../controllers/auditController');
const notificationController = require('../controllers/notificationController');
const dbmsController = require('../controllers/dbmsController');

// 1. Health Endpoint
router.get('/health', async (req, res) => {
    try {
        const [[row]] = await db.query('SELECT 1 + 1 AS result, CURRENT_TIMESTAMP() AS server_time, DATABASE() AS database_name;');
        res.json({
            success: true,
            status: 'HEALTHY',
            database: row.database_name,
            timestamp: row.server_time,
            message: 'Lab Allocation System Backend & MySQL 8 Database are operational'
        });
    } catch (err) {
        res.status(503).json({
            success: false,
            status: 'UNHEALTHY',
            error: err.message
        });
    }
});

// 2. Dashboard
router.get('/dashboard/summary', dashboardController.getDashboardSummary);

// 3. Schedules
router.get('/schedules', scheduleController.listSchedules);
router.get('/schedules/:id', scheduleController.getScheduleById);
router.post('/schedules', scheduleController.createSchedule);
router.delete('/schedules/:id', scheduleController.deleteSchedule);
router.post('/schedules/:id/allocate-seats', scheduleController.allocateSeats);

// 4. Labs
router.get('/labs', labController.listLabs);
router.get('/labs/:id', labController.getLabById);
router.post('/labs', labController.createLab);
router.put('/labs/:id', labController.updateLab);
router.delete('/labs/:id', labController.deleteLab);

// 5. Workstations
router.get('/workstations', workstationController.listWorkstations);
router.post('/workstations', workstationController.createWorkstation);
router.put('/workstations/:id', workstationController.updateWorkstation);
router.delete('/workstations/:id', workstationController.deleteWorkstation);

// 6. Ad-Hoc Requests
router.get('/ad-hoc', adHocController.listAdHocRequests);
router.post('/ad-hoc', adHocController.createAdHocRequest);
router.post('/ad-hoc/:id/approve', adHocController.approveAdHocRequest);
router.post('/ad-hoc/:id/reject', adHocController.rejectAdHocRequest);

// 7. Courses
router.get('/courses', courseController.listCourses);
router.post('/courses', courseController.createCourse);
router.delete('/courses/:id', courseController.deleteCourse);

// 8. Users & Timetable
router.get('/users', userController.listUsers);
router.post('/users', userController.createUser);
router.get('/users/:studentId/timetable', userController.getStudentTimetable);

// 9. Batches, Departments, Slots, Catalogs
router.get('/batches', batchController.listBatches);
router.get('/departments', batchController.listDepartments);
router.get('/time-slots', batchController.listTimeSlots);
router.get('/catalogs', batchController.listSoftwareAndOS);

// 10. Issue Reports
router.get('/issues', issueController.listIssues);
router.post('/issues', issueController.createIssue);
router.put('/issues/:id/status', issueController.updateIssueStatus);

// 11. Audit Logs
router.get('/audit-logs', auditController.listAuditLogs);

// 12. Notifications
router.get('/notifications', notificationController.listNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);

// 13. DBMS Showcase Queries (Predefined queries only)
router.get('/dbms/queries', dbmsController.getShowcaseQueries);
router.post('/dbms/execute', dbmsController.executeShowcaseQuery);

module.exports = router;
