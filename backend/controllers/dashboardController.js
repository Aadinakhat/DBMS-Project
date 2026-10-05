const db = require('../db');

exports.getDashboardSummary = async (req, res, next) => {
    try {
        // Run aggregate counts
        const [[stats]] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM lab) AS total_labs,
                (SELECT COUNT(*) FROM workstation) AS total_workstations,
                (SELECT COUNT(*) FROM workstation WHERE status = 'ACTIVE') AS active_workstations,
                (SELECT COUNT(*) FROM workstation WHERE status = 'FAULTY') AS faulty_workstations,
                (SELECT COUNT(*) FROM schedule) AS total_schedules,
                (SELECT COUNT(*) FROM ad_hoc_request WHERE status = 'PENDING') AS pending_adhoc,
                (SELECT COUNT(*) FROM issue_report WHERE status <> 'RESOLVED') AS open_issues,
                (SELECT COUNT(*) FROM app_user WHERE role = 'STUDENT') AS total_students,
                (SELECT COUNT(*) FROM app_user WHERE role = 'FACULTY') AS total_faculty
        `);

        // Lab utilization chart data (from view vw_lab_utilization)
        const [utilizationData] = await db.query(`
            SELECT lab_name, capacity, gpu_capacity, booked_slots, total_available_slots, utilization_percentage
            FROM vw_lab_utilization
            ORDER BY utilization_percentage DESC;
        `);

        // Hardware health chart data (from view vw_lab_health_status)
        const [healthData] = await db.query(`
            SELECT lab_name, capacity, total_workstations, active_workstations, faulty_workstations, maintenance_workstations, usable_percentage
            FROM vw_lab_health_status;
        `);

        // Sessions per department
        const [deptSessions] = await db.query(`
            SELECT d.dept_name, COUNT(s.schedule_id) AS session_count
            FROM department d
            LEFT JOIN course c ON c.dept_id = d.dept_id
            LEFT JOIN schedule s ON s.course_id = c.course_id
            GROUP BY d.dept_id, d.dept_name;
        `);

        // Recent Audit Log
        const [recentActivity] = await db.query(`
            SELECT log_id, action_type, entity_name, entity_id, performed_by, details, timestamp
            FROM audit_log
            ORDER BY log_id DESC
            LIMIT 6;
        `);

        res.json({
            success: true,
            data: {
                stats,
                utilizationData,
                healthData,
                deptSessions,
                recentActivity
            },
            message: 'Dashboard summary retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};
