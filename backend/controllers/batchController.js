const db = require('../db');

exports.listBatches = async (req, res, next) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                b.batch_id,
                b.batch_name,
                b.dept_id,
                d.dept_name,
                COUNT(sb.student_id) AS student_count
            FROM batch b
            JOIN department d ON d.dept_id = b.dept_id
            LEFT JOIN student_batch sb ON sb.batch_id = b.batch_id
            GROUP BY b.batch_id, b.batch_name, b.dept_id, d.dept_name
            ORDER BY b.batch_name;
        `);

        res.json({
            success: true,
            data: rows,
            message: 'Batches retrieved'
        });
    } catch (err) {
        next(err);
    }
};

exports.listDepartments = async (req, res, next) => {
    try {
        const [rows] = await db.query(`
            SELECT dept_id, dept_name 
            FROM department 
            ORDER BY dept_name
        `);

        res.json({
            success: true,
            data: rows,
            message: 'Departments retrieved'
        });
    } catch (err) {
        next(err);
    }
};

exports.listTimeSlots = async (req, res, next) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                slot_id,
                day_of_week,
                CASE day_of_week
                    WHEN 1 THEN 'Monday' WHEN 2 THEN 'Tuesday' WHEN 3 THEN 'Wednesday'
                    WHEN 4 THEN 'Thursday' WHEN 5 THEN 'Friday' WHEN 6 THEN 'Saturday' WHEN 7 THEN 'Sunday'
                END AS day_name,
                start_time,
                end_time
            FROM time_slot
            ORDER BY day_of_week, start_time;
        `);

        res.json({
            success: true,
            data: rows,
            message: 'Time slots retrieved'
        });
    } catch (err) {
        next(err);
    }
};

exports.listSoftwareAndOS = async (req, res, next) => {
    try {
        const [software] = await db.query('SELECT software_id, software_name FROM software ORDER BY software_name');
        const [operatingSystems] = await db.query('SELECT os_id, os_name FROM operating_system ORDER BY os_name');

        res.json({
            success: true,
            data: { software, operatingSystems },
            message: 'Software and OS catalogs retrieved'
        });
    } catch (err) {
        next(err);
    }
};
