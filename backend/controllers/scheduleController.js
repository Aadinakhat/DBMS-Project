const db = require('../db');

exports.listSchedules = async (req, res, next) => {
    try {
        const { lab_id, faculty_id, batch_id, day_of_week, search, page = 1, limit = 50 } = req.query;
        let sql = `
            SELECT 
                s.schedule_id,
                s.course_id,
                c.course_code,
                c.course_name,
                s.faculty_id,
                f.name AS faculty_name,
                s.lab_id,
                l.lab_name,
                s.slot_id,
                t.day_of_week,
                CASE t.day_of_week
                    WHEN 1 THEN 'Monday' WHEN 2 THEN 'Tuesday' WHEN 3 THEN 'Wednesday'
                    WHEN 4 THEN 'Thursday' WHEN 5 THEN 'Friday' WHEN 6 THEN 'Saturday' WHEN 7 THEN 'Sunday'
                END AS day_name,
                t.start_time,
                t.end_time,
                s.batch_id,
                b.batch_name,
                s.session_type,
                (SELECT COUNT(*) FROM workstation_allocation wa WHERE wa.schedule_id = s.schedule_id) AS allocated_seats_count
            FROM schedule s
            JOIN course c ON c.course_id = s.course_id
            JOIN app_user f ON f.user_id = s.faculty_id
            JOIN lab l ON l.lab_id = s.lab_id
            JOIN time_slot t ON t.slot_id = s.slot_id
            JOIN batch b ON b.batch_id = s.batch_id
            WHERE 1=1
        `;
        const params = [];

        if (lab_id) {
            sql += ' AND s.lab_id = ?';
            params.push(parseInt(lab_id, 10));
        }
        if (faculty_id) {
            sql += ' AND s.faculty_id = ?';
            params.push(parseInt(faculty_id, 10));
        }
        if (batch_id) {
            sql += ' AND s.batch_id = ?';
            params.push(parseInt(batch_id, 10));
        }
        if (day_of_week) {
            sql += ' AND t.day_of_week = ?';
            params.push(parseInt(day_of_week, 10));
        }
        if (search) {
            sql += ' AND (c.course_code LIKE ? OR c.course_name LIKE ? OR l.lab_name LIKE ? OR f.name LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam, searchParam);
        }

        sql += ' ORDER BY t.day_of_week, t.start_time';

        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit, 10), offset);

        const [rows] = await db.query(sql, params);

        res.json({
            success: true,
            data: rows,
            message: 'Schedules retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.getScheduleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [schedules] = await db.query(`
            SELECT 
                s.schedule_id,
                s.course_id,
                c.course_code,
                c.course_name,
                s.faculty_id,
                f.name AS faculty_name,
                s.lab_id,
                l.lab_name,
                s.slot_id,
                t.day_of_week,
                t.start_time,
                t.end_time,
                s.batch_id,
                b.batch_name,
                s.session_type
            FROM schedule s
            JOIN course c ON c.course_id = s.course_id
            JOIN app_user f ON f.user_id = s.faculty_id
            JOIN lab l ON l.lab_id = s.lab_id
            JOIN time_slot t ON t.slot_id = s.slot_id
            JOIN batch b ON b.batch_id = s.batch_id
            WHERE s.schedule_id = ?
        `, [id]);

        if (schedules.length === 0) {
            return res.status(404).json({ success: false, message: 'Schedule not found' });
        }

        // Get seat allocations
        const [allocations] = await db.query(`
            SELECT 
                wa.student_id,
                u.name AS student_name,
                u.email AS student_email,
                wa.workstation_id,
                w.station_number,
                w.status AS station_status
            FROM workstation_allocation wa
            JOIN app_user u ON u.user_id = wa.student_id
            JOIN workstation w ON w.workstation_id = wa.workstation_id
            WHERE wa.schedule_id = ?
            ORDER BY w.station_number
        `, [id]);

        res.json({
            success: true,
            data: {
                schedule: schedules[0],
                allocations
            },
            message: 'Schedule details retrieved'
        });
    } catch (err) {
        next(err);
    }
};

exports.createSchedule = async (req, res, next) => {
    try {
        const { course_id, faculty_id, lab_id, slot_id, batch_id, session_type = 'PRACTICAL' } = req.body;

        if (!course_id || !faculty_id || !lab_id || !slot_id || !batch_id) {
            return res.status(400).json({
                success: false,
                message: 'All scheduling parameters (course, faculty, lab, slot, batch) are required'
            });
        }

        const [result] = await db.query(`
            INSERT INTO schedule (course_id, faculty_id, lab_id, slot_id, batch_id, session_type)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [course_id, faculty_id, lab_id, slot_id, batch_id, session_type]);

        res.status(201).json({
            success: true,
            data: { schedule_id: result.insertId },
            message: 'Master schedule entry created successfully (Audit trigger executed)'
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteSchedule = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM schedule WHERE schedule_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Schedule record not found' });
        }

        res.json({
            success: true,
            data: null,
            message: 'Schedule removed successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.allocateSeats = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Call stored procedure sp_allocate_student_seats
        await db.query('CALL sp_allocate_student_seats(?)', [id]);

        const [allocations] = await db.query(`
            SELECT 
                wa.student_id,
                u.name AS student_name,
                w.station_number
            FROM workstation_allocation wa
            JOIN app_user u ON u.user_id = wa.student_id
            JOIN workstation w ON w.workstation_id = wa.workstation_id
            WHERE wa.schedule_id = ?
            ORDER BY w.station_number
        `, [id]);

        res.json({
            success: true,
            data: allocations,
            message: `Successfully allocated workstations for ${allocations.length} students via Stored Procedure`
        });
    } catch (err) {
        next(err);
    }
};
