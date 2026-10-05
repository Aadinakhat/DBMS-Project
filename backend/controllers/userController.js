const db = require('../db');

exports.listUsers = async (req, res, next) => {
    try {
        const { role, dept_id, search } = req.query;
        let sql = `
            SELECT 
                u.user_id,
                u.name,
                u.email,
                u.role,
                u.dept_id,
                d.dept_name,
                b.batch_id,
                b.batch_name
            FROM app_user u
            LEFT JOIN department d ON d.dept_id = u.dept_id
            LEFT JOIN student_batch sb ON sb.student_id = u.user_id
            LEFT JOIN batch b ON b.batch_id = sb.batch_id
            WHERE 1=1
        `;
        const params = [];

        if (role) {
            sql += ' AND u.role = ?';
            params.push(role);
        }
        if (dept_id) {
            sql += ' AND u.dept_id = ?';
            params.push(parseInt(dept_id, 10));
        }
        if (search) {
            sql += ' AND (u.name LIKE ? OR u.email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ' ORDER BY u.role, u.name';

        const [rows] = await db.query(sql, params);

        res.json({
            success: true,
            data: rows,
            message: 'Users retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.getStudentTimetable = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        // Query the database VIEW vw_student_timetable
        const [rows] = await db.query(`
            SELECT 
                student_id,
                student_name,
                day_of_week,
                day_name,
                start_time,
                end_time,
                course_code,
                course_name,
                lab_name,
                station_number,
                faculty_name,
                batch_name,
                session_type,
                schedule_id
            FROM vw_student_timetable
            WHERE student_id = ?
            ORDER BY day_of_week, start_time;
        `, [studentId]);

        res.json({
            success: true,
            data: rows,
            message: `Student timetable fetched via Database View vw_student_timetable`
        });
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, role, dept_id, batch_id } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
        }

        const [result] = await db.query(`
            INSERT INTO app_user (name, email, password_hash, role, dept_id)
            VALUES (?, ?, '$2b$10$defaultHashPlaceholder', ?, ?)
        `, [name, email, role, dept_id || null]);

        const user_id = result.insertId;

        // If student and batch_id provided, map student_batch
        if (role === 'STUDENT' && batch_id) {
            await db.query(`INSERT INTO student_batch (student_id, batch_id) VALUES (?, ?)`, [user_id, batch_id]);
        }

        res.status(201).json({
            success: true,
            data: { user_id },
            message: 'User created successfully'
        });
    } catch (err) {
        next(err);
    }
};
