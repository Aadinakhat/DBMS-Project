const db = require('../db');

exports.listCourses = async (req, res, next) => {
    try {
        const { dept_id } = req.query;
        let sql = `
            SELECT 
                c.course_id,
                c.course_code,
                c.course_name,
                c.dept_id,
                d.dept_name,
                (
                    SELECT GROUP_CONCAT(sw.software_name ORDER BY sw.software_name SEPARATOR ', ')
                    FROM course_software cs
                    JOIN software sw ON sw.software_id = cs.software_id
                    WHERE cs.course_id = c.course_id
                ) AS required_software,
                (SELECT COUNT(*) FROM schedule s WHERE s.course_id = c.course_id) AS scheduled_sessions
            FROM course c
            JOIN department d ON d.dept_id = c.dept_id
            WHERE 1=1
        `;
        const params = [];

        if (dept_id) {
            sql += ' AND c.dept_id = ?';
            params.push(parseInt(dept_id, 10));
        }

        sql += ' ORDER BY c.course_code';

        const [rows] = await db.query(sql, params);

        res.json({
            success: true,
            data: rows,
            message: 'Courses retrieved'
        });
    } catch (err) {
        next(err);
    }
};

exports.createCourse = async (req, res, next) => {
    try {
        const { course_code, course_name, dept_id, software_ids = [] } = req.body;

        if (!course_code || !course_name || !dept_id) {
            return res.status(400).json({ success: false, message: 'Course code, name, and department are required' });
        }

        const [result] = await db.query(`
            INSERT INTO course (course_code, course_name, dept_id)
            VALUES (?, ?, ?)
        `, [course_code, course_name, dept_id]);

        const course_id = result.insertId;

        for (const sId of software_ids) {
            await db.query(`INSERT IGNORE INTO course_software (course_id, software_id) VALUES (?, ?)`, [course_id, sId]);
        }

        res.status(201).json({
            success: true,
            data: { course_id },
            message: 'Course created successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM course WHERE course_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.json({
            success: true,
            data: null,
            message: 'Course deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
