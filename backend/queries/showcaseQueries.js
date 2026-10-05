/**
 * Predefined DBMS Showcase Queries for Viva & Examination
 * Contains raw, explainable SQL queries demonstrating core database concepts.
 * No arbitrary SQL is accepted from the client - only predefined queries are permitted.
 */

const showcaseQueries = [
    {
        id: 'q1-join-student-timetable',
        name: 'Personalized Student Timetable',
        concept: 'Multi-table JOIN (INNER & LEFT JOIN)',
        description: 'Demonstrates a 7-table join connecting students to batches, courses, assigned labs, time slots, faculty, and personalized workstation seat allocations.',
        sql: `SELECT 
    t.day_of_week, 
    CASE t.day_of_week
        WHEN 1 THEN 'Monday' WHEN 2 THEN 'Tuesday' WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday' WHEN 5 THEN 'Friday' WHEN 6 THEN 'Saturday' WHEN 7 THEN 'Sunday'
    END AS day_name,
    t.start_time, t.end_time,
    c.course_code, c.course_name, 
    l.lab_name,
    w.station_number, 
    f.name AS faculty_name,
    s.session_type
FROM student_batch sb
JOIN schedule s ON s.batch_id = sb.batch_id
JOIN course c ON c.course_id = s.course_id
JOIN lab l ON l.lab_id = s.lab_id
JOIN time_slot t ON t.slot_id = s.slot_id
JOIN app_user f ON f.user_id = s.faculty_id
LEFT JOIN workstation_allocation wa 
    ON wa.schedule_id = s.schedule_id AND wa.student_id = sb.student_id
LEFT JOIN workstation w 
    ON w.workstation_id = wa.workstation_id
WHERE sb.student_id = ?
ORDER BY t.day_of_week, t.start_time;`,
        defaultParams: [7] // Student Asha Patel
    },
    {
        id: 'q2-master-schedule-view',
        name: 'Master Timetable via Database View',
        concept: 'Database VIEW (vw_master_schedule)',
        description: 'Demonstrates query execution against a database VIEW that consolidates schedules, courses, labs, faculty, and time slots into a single virtual relation.',
        sql: `SELECT 
    day_name, 
    start_time, 
    end_time, 
    course_code, 
    course_name, 
    lab_name, 
    faculty_name, 
    batch_name, 
    session_type
FROM vw_master_schedule
ORDER BY day_of_week, start_time;`,
        defaultParams: []
    },
    {
        id: 'q3-free-labs-subquery',
        name: 'Free Labs for Slot with Software Filter',
        concept: 'Correlated Subqueries with EXISTS & NOT EXISTS',
        description: 'Finds computing labs with capacity >= 25 that have Python installed and are NOT booked in the master timetable nor occupied by an approved ad-hoc request on slot 4.',
        sql: `SELECT 
    l.lab_id, 
    l.lab_name, 
    l.capacity, 
    l.gpu_capacity
FROM lab l
WHERE l.capacity >= 25
  AND EXISTS (
      SELECT 1 FROM lab_software ls
      JOIN software sw ON sw.software_id = ls.software_id
      WHERE ls.lab_id = l.lab_id AND sw.software_name LIKE '%Python%'
  )
  AND NOT EXISTS (
      SELECT 1 FROM schedule s
      WHERE s.lab_id = l.lab_id AND s.slot_id = 4
  )
  AND NOT EXISTS (
      SELECT 1 FROM ad_hoc_request a
      WHERE a.lab_id = l.lab_id AND a.slot_id = 4 
        AND a.request_date = '2026-10-13' AND a.status = 'APPROVED'
  );`,
        defaultParams: []
    },
    {
        id: 'q4-relational-division-course-software',
        name: 'Relational Division (All Software Requirement)',
        concept: 'Relational Division via Double NOT EXISTS',
        description: 'Identifies labs that satisfy the complete universal software toolset demanded by a course (e.g., Course #2: Machine Learning requiring Python, CUDA, and TensorFlow). Relational Division: Labs / Software.',
        sql: `SELECT 
    l.lab_id,
    l.lab_name,
    l.gpu_capacity
FROM lab l
WHERE NOT EXISTS (
    SELECT cs.software_id 
    FROM course_software cs
    WHERE cs.course_id = 2
      AND NOT EXISTS (
          SELECT 1 
          FROM lab_software ls
          WHERE ls.lab_id = l.lab_id AND ls.software_id = cs.software_id
      )
);`,
        defaultParams: []
    },
    {
        id: 'q5-lab-utilization-aggregate',
        name: 'Weekly Laboratory Utilization Rate',
        concept: 'GROUP BY, Aggregate COUNT, Scalar Subquery',
        description: 'Computes total booked sessions per lab as an exact percentage against the total available timetable slots.',
        sql: `SELECT 
    l.lab_id,
    l.lab_name,
    COUNT(s.schedule_id) AS booked_slots,
    (SELECT COUNT(*) FROM time_slot) AS total_available_slots,
    ROUND((COUNT(s.schedule_id) * 100.0) / (SELECT COUNT(*) FROM time_slot), 2) AS utilization_pct
FROM lab l
LEFT JOIN schedule s ON s.lab_id = l.lab_id
GROUP BY l.lab_id, l.lab_name
ORDER BY utilization_pct DESC;`,
        defaultParams: []
    },
    {
        id: 'q6-labs-above-average-usage',
        name: 'Labs Used More Than Average',
        concept: 'GROUP BY + HAVING with Nested Subquery Aggregate',
        description: 'Identifies high-traffic labs that host strictly more sessions than the university-wide laboratory average session count.',
        sql: `SELECT 
    l.lab_name, 
    COUNT(s.schedule_id) AS total_sessions
FROM schedule s
JOIN lab l ON l.lab_id = s.lab_id
GROUP BY l.lab_id, l.lab_name
HAVING COUNT(s.schedule_id) > (
    SELECT AVG(lab_count) 
    FROM (
        SELECT COUNT(schedule_id) AS lab_count
        FROM schedule
        GROUP BY lab_id
    ) AS lab_aggregates
)
ORDER BY total_sessions DESC;`,
        defaultParams: []
    },
    {
        id: 'q7-underutilized-labs',
        name: 'Underutilized Labs (Never Scheduled)',
        concept: 'Set Difference via NOT IN Subqueries',
        description: 'Finds laboratories currently dormant (neither booked in the recurring master timetable nor scheduled for approved ad-hoc reservations).',
        sql: `SELECT 
    lab_id, 
    lab_name, 
    capacity, 
    gpu_capacity 
FROM lab
WHERE lab_id NOT IN (SELECT DISTINCT lab_id FROM schedule)
  AND lab_id NOT IN (SELECT DISTINCT lab_id FROM ad_hoc_request WHERE status = 'APPROVED');`,
        defaultParams: []
    },
    {
        id: 'q8-faculty-workload-having',
        name: 'Faculty Teaching Load Distribution',
        concept: 'GROUP BY + HAVING filtering',
        description: 'Aggregates practical teaching hours per faculty instructor and filters for professors handling 2 or more lab sessions weekly.',
        sql: `SELECT 
    f.user_id,
    f.name AS faculty_name,
    f.email,
    COUNT(s.schedule_id) AS total_sessions
FROM app_user f
JOIN schedule s ON s.faculty_id = f.user_id
GROUP BY f.user_id, f.name, f.email
HAVING COUNT(s.schedule_id) >= 2
ORDER BY total_sessions DESC;`,
        defaultParams: []
    },
    {
        id: 'q9-busiest-time-slots',
        name: 'Peak Hour Time Slot Analysis',
        concept: 'Multi-column Aggregation & Ordering',
        description: 'Finds peak timetable periods by counting concurrent lab allocations across the weekly calendar.',
        sql: `SELECT 
    t.slot_id,
    CASE t.day_of_week
        WHEN 1 THEN 'Monday' WHEN 2 THEN 'Tuesday' WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday' WHEN 5 THEN 'Friday' WHEN 6 THEN 'Saturday' WHEN 7 THEN 'Sunday'
    END AS day_name,
    t.start_time, 
    t.end_time, 
    COUNT(s.schedule_id) AS labs_concurrently_occupied
FROM time_slot t
JOIN schedule s ON s.slot_id = t.slot_id
GROUP BY t.slot_id, t.day_of_week, t.start_time, t.end_time
ORDER BY labs_concurrently_occupied DESC, t.day_of_week;`,
        defaultParams: []
    },
    {
        id: 'q10-workstation-defects-joined',
        name: 'Hardware Issues by Workstation',
        concept: '3-Table JOIN + Aggregation with Filter',
        description: 'Pinpoints problematic workstations requiring IT maintenance by joining issue tickets with physical labs and stations.',
        sql: `SELECT 
    l.lab_name, 
    w.station_number, 
    w.status AS current_station_status,
    COUNT(i.issue_id) AS open_tickets,
    GROUP_CONCAT(i.description SEPARATOR ' | ') AS issue_descriptions
FROM issue_report i
JOIN workstation w ON w.workstation_id = i.workstation_id
JOIN lab l ON l.lab_id = w.lab_id
WHERE i.status <> 'RESOLVED'
GROUP BY l.lab_name, w.station_number, w.status
ORDER BY open_tickets DESC;`,
        defaultParams: []
    },
    {
        id: 'q11-lab-health-conditional-aggregation',
        name: 'Lab Hardware Health Audit',
        concept: 'Conditional Aggregation (SUM with CASE)',
        description: 'Calculates active vs faulty hardware terminal counts and compute operational readiness percentage.',
        sql: `SELECT 
    l.lab_id,
    l.lab_name, 
    l.capacity,
    COUNT(w.workstation_id) AS installed_terminals,
    SUM(CASE WHEN w.status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_terminals,
    SUM(CASE WHEN w.status = 'FAULTY' THEN 1 ELSE 0 END) AS faulty_terminals,
    ROUND((SUM(CASE WHEN w.status = 'ACTIVE' THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(w.workstation_id), 0), 1) AS operational_health_pct
FROM lab l
LEFT JOIN workstation w ON w.lab_id = l.lab_id
GROUP BY l.lab_id, l.lab_name, l.capacity;`,
        defaultParams: []
    },
    {
        id: 'q12-admin-clash-detection',
        name: 'Ad-Hoc Conflict Detection Screen',
        concept: 'Real-time Conflict Verification with Subqueries',
        description: 'Dynamically computes whether pending reservation requests clash with the recurring master timetable or other approved requests.',
        sql: `SELECT 
    a.request_id,
    f.name AS faculty_name,
    l.lab_name,
    a.request_date,
    t.start_time,
    t.end_time,
    a.reason,
    (SELECT COUNT(*) FROM schedule s WHERE s.lab_id = a.lab_id AND s.slot_id = a.slot_id) > 0 AS clashes_with_master,
    (SELECT COUNT(*) FROM ad_hoc_request b 
     WHERE b.lab_id = a.lab_id AND b.slot_id = a.slot_id 
       AND b.request_date = a.request_date AND b.status = 'APPROVED' AND b.request_id != a.request_id) > 0 AS clashes_with_adhoc
FROM ad_hoc_request a
JOIN app_user f ON f.user_id = a.faculty_id
JOIN lab l ON l.lab_id = a.lab_id
JOIN time_slot t ON t.slot_id = a.slot_id
WHERE a.status = 'PENDING';`,
        defaultParams: []
    },
    {
        id: 'q13-call-function-availability',
        name: 'Function: Lab Slot Availability Check',
        concept: 'Stored Function Call (fn_check_lab_availability)',
        description: 'Invokes the user-defined SQL scalar function to determine real-time lab availability for a given date and time slot.',
        sql: `SELECT 
    lab_id, 
    lab_name, 
    fn_check_lab_availability(lab_id, 4, '2026-10-13') AS is_available_slot_4,
    fn_check_lab_availability(lab_id, 1, '2026-10-12') AS is_available_slot_1
FROM lab;`,
        defaultParams: []
    },
    {
        id: 'q14-audit-trail-trigger-events',
        name: 'Live Audit Log Fired by Triggers',
        concept: 'Triggers & Audit Trail Table',
        description: 'Inspects the audit trail automatically populated by MySQL database triggers (SCHEDULE_CREATED, ISSUE_REPORTED, ADHOC_APPROVED).',
        sql: `SELECT 
    log_id, 
    action_type, 
    entity_name, 
    entity_id, 
    performed_by, 
    details, 
    timestamp
FROM audit_log
ORDER BY log_id DESC
LIMIT 25;`,
        defaultParams: []
    }
];

module.exports = showcaseQueries;
