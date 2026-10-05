const db = require('../db');

exports.listAdHocRequests = async (req, res, next) => {
    try {
        const { status, faculty_id } = req.query;
        let sql = `
            SELECT 
                a.request_id,
                a.faculty_id,
                f.name AS faculty_name,
                a.lab_id,
                l.lab_name,
                a.slot_id,
                t.day_of_week,
                CASE t.day_of_week
                    WHEN 1 THEN 'Monday' WHEN 2 THEN 'Tuesday' WHEN 3 THEN 'Wednesday'
                    WHEN 4 THEN 'Thursday' WHEN 5 THEN 'Friday' WHEN 6 THEN 'Saturday' WHEN 7 THEN 'Sunday'
                END AS day_name,
                t.start_time,
                t.end_time,
                a.course_id,
                c.course_name,
                c.course_code,
                a.request_date,
                a.status,
                a.reason,
                a.reviewed_by,
                r.name AS reviewer_name,
                a.created_at,
                -- Dynamic conflict check preview
                (SELECT COUNT(*) FROM schedule s WHERE s.lab_id = a.lab_id AND s.slot_id = a.slot_id) > 0 AS clashes_with_master,
                (SELECT COUNT(*) FROM ad_hoc_request b 
                 WHERE b.lab_id = a.lab_id AND b.slot_id = a.slot_id 
                   AND b.request_date = a.request_date AND b.status = 'APPROVED' AND b.request_id != a.request_id) > 0 AS clashes_with_approved
            FROM ad_hoc_request a
            JOIN app_user f ON f.user_id = a.faculty_id
            JOIN lab l ON l.lab_id = a.lab_id
            JOIN time_slot t ON t.slot_id = a.slot_id
            LEFT JOIN course c ON c.course_id = a.course_id
            LEFT JOIN app_user r ON r.user_id = a.reviewed_by
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            sql += ' AND a.status = ?';
            params.push(status);
        }
        if (faculty_id) {
            sql += ' AND a.faculty_id = ?';
            params.push(parseInt(faculty_id, 10));
        }

        sql += ' ORDER BY a.request_date DESC, a.created_at DESC';

        const [rows] = await db.query(sql, params);

        res.json({
            success: true,
            data: rows,
            message: 'Ad-hoc requests retrieved'
        });
    } catch (err) {
        next(err);
    }
};

exports.createAdHocRequest = async (req, res, next) => {
    try {
        const { faculty_id, lab_id, slot_id, course_id, request_date, reason } = req.body;

        if (!faculty_id || !lab_id || !slot_id || !request_date) {
            return res.status(400).json({
                success: false,
                message: 'Faculty, lab, slot, and request date are required'
            });
        }

        // Call stored procedure sp_book_ad_hoc_slot
        await db.query(`
            SET @new_id = 0;
            CALL sp_book_ad_hoc_slot(?, ?, ?, ?, ?, ?, @new_id);
        `, [faculty_id, lab_id, slot_id, course_id || null, request_date, reason || '']);

        const [[{ new_id }]] = await db.query('SELECT @new_id AS new_id');

        res.status(201).json({
            success: true,
            data: { request_id: new_id },
            message: 'Ad-hoc slot reservation submitted (Stored Procedure sp_book_ad_hoc_slot)'
        });
    } catch (err) {
        next(err);
    }
};

exports.approveAdHocRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { admin_id = 1 } = req.body;

        // Call Stored Procedure sp_approve_ad_hoc_request with ACID Transaction
        await db.query('CALL sp_approve_ad_hoc_request(?, ?)', [id, admin_id]);

        res.json({
            success: true,
            data: { request_id: id, status: 'APPROVED' },
            message: 'Ad-hoc booking approved atomically via Stored Procedure sp_approve_ad_hoc_request'
        });
    } catch (err) {
        next(err);
    }
};

exports.rejectAdHocRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { admin_id = 1, reason = 'Administrative decision' } = req.body;

        await db.query(`
            UPDATE ad_hoc_request 
            SET status = 'REJECTED', reviewed_by = ?
            WHERE request_id = ?
        `, [admin_id, id]);

        // Insert notification
        const [[reqData]] = await db.query('SELECT faculty_id FROM ad_hoc_request WHERE request_id = ?', [id]);
        if (reqData) {
            await db.query(`
                INSERT INTO notification (user_id, message) 
                VALUES (?, CONCAT('Your ad-hoc booking #', ?, ' was rejected: ', ?))
            `, [reqData.faculty_id, id, reason]);
        }

        res.json({
            success: true,
            data: { request_id: id, status: 'REJECTED' },
            message: 'Ad-hoc reservation rejected'
        });
    } catch (err) {
        next(err);
    }
};
