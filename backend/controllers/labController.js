const db = require('../db');

exports.getAvailableLabs = async (req, res, next) => {
    try {
        const { slot_id } = req.query;

        if (!slot_id) {
            return res.status(400).json({
                success: false,
                message: 'slot_id query parameter is required to check available locations'
            });
        }

        // 1. Fetch target time slot details from database
        const [[targetSlot]] = await db.query(`
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
            WHERE slot_id = ?
        `, [slot_id]);

        if (!targetSlot) {
            return res.status(404).json({
                success: false,
                message: 'Target time slot not found'
            });
        }

        // 2. Query available labs using Stored Procedure sp_get_available_labs (with resilient SQL fallback)
        let availableLabs = [];
        try {
            const [spResult] = await db.query('CALL sp_get_available_labs(?)', [slot_id]);
            availableLabs = spResult[0] || [];
        } catch (spErr) {
            // Fallback direct SQL query
            const [queryResult] = await db.query(`
                SELECT 
                    l.lab_id,
                    l.lab_name,
                    l.capacity,
                    l.gpu_capacity,
                    COUNT(DISTINCT w.workstation_id) AS total_workstations,
                    SUM(CASE WHEN w.status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_workstations,
                    (
                        SELECT GROUP_CONCAT(sw.software_name ORDER BY sw.software_name SEPARATOR ', ')
                        FROM lab_software ls
                        JOIN software sw ON sw.software_id = ls.software_id
                        WHERE ls.lab_id = l.lab_id
                    ) AS installed_software,
                    (
                        SELECT GROUP_CONCAT(os.os_name ORDER BY os.os_name SEPARATOR ', ')
                        FROM lab_os lo
                        JOIN operating_system os ON os.os_id = lo.os_id
                        WHERE lo.lab_id = l.lab_id
                    ) AS installed_os
                FROM lab l
                LEFT JOIN workstation w ON w.lab_id = l.lab_id
                WHERE l.lab_id NOT IN (
                    SELECT DISTINCT s.lab_id
                    FROM schedule s
                    JOIN time_slot ts ON ts.slot_id = s.slot_id
                    WHERE ts.day_of_week = ?
                      AND ts.start_time < ?
                      AND ts.end_time > ?
                )
                GROUP BY l.lab_id, l.lab_name, l.capacity, l.gpu_capacity
                ORDER BY l.lab_name ASC
            `, [targetSlot.day_of_week, targetSlot.end_time, targetSlot.start_time]);
            availableLabs = queryResult;
        }

        // 3. Query occupied labs for rich diagnostic metadata
        const [occupiedLabs] = await db.query(`
            SELECT 
                l.lab_id,
                l.lab_name,
                c.course_code,
                c.course_name,
                b.batch_name,
                f.name AS faculty_name,
                ts.start_time,
                ts.end_time,
                s.session_type
            FROM schedule s
            JOIN lab l ON l.lab_id = s.lab_id
            JOIN course c ON c.course_id = s.course_id
            JOIN batch b ON b.batch_id = s.batch_id
            JOIN app_user f ON f.user_id = s.faculty_id
            JOIN time_slot ts ON ts.slot_id = s.slot_id
            WHERE ts.day_of_week = ?
              AND ts.start_time < ?
              AND ts.end_time > ?
            ORDER BY l.lab_name ASC
        `, [targetSlot.day_of_week, targetSlot.end_time, targetSlot.start_time]);

        const [[{ total_labs }]] = await db.query('SELECT COUNT(*) AS total_labs FROM lab');

        res.json({
            success: true,
            data: availableLabs,
            meta: {
                slot: targetSlot,
                availableCount: availableLabs.length,
                occupiedCount: occupiedLabs.length,
                totalCount: total_labs,
                occupiedLabs
            },
            message: `Retrieved ${availableLabs.length} available locations for ${targetSlot.day_name} (${targetSlot.start_time.substring(0, 5)} - ${targetSlot.end_time.substring(0, 5)}) via Stored Procedure sp_get_available_labs`
        });
    } catch (err) {
        next(err);
    }
};

exports.listLabs = async (req, res, next) => {
    try {
        const { search, slot_id } = req.query;
        let sql = `
            SELECT 
                l.lab_id,
                l.lab_name,
                l.capacity,
                l.gpu_capacity,
                COUNT(DISTINCT w.workstation_id) AS total_workstations,
                SUM(CASE WHEN w.status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_workstations,
                SUM(CASE WHEN w.status = 'FAULTY' THEN 1 ELSE 0 END) AS faulty_workstations,
                (
                    SELECT GROUP_CONCAT(sw.software_name ORDER BY sw.software_name SEPARATOR ', ')
                    FROM lab_software ls
                    JOIN software sw ON sw.software_id = ls.software_id
                    WHERE ls.lab_id = l.lab_id
                ) AS installed_software,
                (
                    SELECT GROUP_CONCAT(os.os_name ORDER BY os.os_name SEPARATOR ', ')
                    FROM lab_os lo
                    JOIN operating_system os ON os.os_id = lo.os_id
                    WHERE lo.lab_id = l.lab_id
                ) AS installed_os
            FROM lab l
            LEFT JOIN workstation w ON w.lab_id = l.lab_id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            sql += ' AND l.lab_name LIKE ?';
            params.push(`%${search}%`);
        }

        if (slot_id) {
            sql += ` AND l.lab_id NOT IN (
                SELECT DISTINCT s.lab_id
                FROM schedule s
                JOIN time_slot ts_existing ON ts_existing.slot_id = s.slot_id
                JOIN time_slot ts_target ON ts_target.slot_id = ?
                WHERE ts_existing.day_of_week = ts_target.day_of_week
                  AND ts_existing.start_time < ts_target.end_time
                  AND ts_existing.end_time > ts_target.start_time
            )`;
            params.push(parseInt(slot_id, 10));
        }

        sql += ' GROUP BY l.lab_id, l.lab_name, l.capacity, l.gpu_capacity ORDER BY l.lab_id';

        const [rows] = await db.query(sql, params);

        res.json({
            success: true,
            data: rows,
            message: 'Labs retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.getLabById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [[lab]] = await db.query(`
            SELECT 
                l.lab_id, 
                l.lab_name, 
                l.capacity, 
                l.gpu_capacity,
                fn_get_lab_utilization_pct(l.lab_id) AS utilization_pct
            FROM lab l
            WHERE l.lab_id = ?
        `, [id]);

        if (!lab) {
            return res.status(404).json({ success: false, message: 'Lab not found' });
        }

        const [workstations] = await db.query(`
            SELECT workstation_id, station_number, status
            FROM workstation
            WHERE lab_id = ?
            ORDER BY station_number
        `, [id]);

        const [software] = await db.query(`
            SELECT sw.software_id, sw.software_name
            FROM lab_software ls
            JOIN software sw ON sw.software_id = ls.software_id
            WHERE ls.lab_id = ?
        `, [id]);

        const [operatingSystems] = await db.query(`
            SELECT os.os_id, os.os_name
            FROM lab_os lo
            JOIN operating_system os ON os.os_id = lo.os_id
            WHERE lo.lab_id = ?
        `, [id]);

        res.json({
            success: true,
            data: {
                ...lab,
                workstations,
                software,
                operatingSystems
            },
            message: 'Lab details retrieved'
        });
    } catch (err) {
        next(err);
    }
};

exports.createLab = async (req, res, next) => {
    try {
        const { lab_name, capacity, gpu_capacity = 0, software_ids = [], os_ids = [] } = req.body;

        if (!lab_name || !capacity) {
            return res.status(400).json({ success: false, message: 'Lab name and capacity are required' });
        }

        const [result] = await db.query(`
            INSERT INTO lab (lab_name, capacity, gpu_capacity)
            VALUES (?, ?, ?)
        `, [lab_name, capacity, gpu_capacity]);

        const lab_id = result.insertId;

        // Auto-create initial workstations
        const wsCount = Math.min(parseInt(capacity, 10), 10);
        for (let i = 1; i <= wsCount; i++) {
            await db.query(`
                INSERT INTO workstation (lab_id, station_number, status)
                VALUES (?, ?, 'ACTIVE')
            `, [lab_id, i]);
        }

        // Link software
        for (const swId of software_ids) {
            await db.query(`INSERT IGNORE INTO lab_software (lab_id, software_id) VALUES (?, ?)`, [lab_id, swId]);
        }

        // Link OS
        for (const osId of os_ids) {
            await db.query(`INSERT IGNORE INTO lab_os (lab_id, os_id) VALUES (?, ?)`, [lab_id, osId]);
        }

        res.status(201).json({
            success: true,
            data: { lab_id },
            message: `Laboratory '${lab_name}' registered with ${wsCount} initial workstations`
        });
    } catch (err) {
        next(err);
    }
};

exports.updateLab = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lab_name, capacity, gpu_capacity } = req.body;

        await db.query(`
            UPDATE lab 
            SET lab_name = COALESCE(?, lab_name),
                capacity = COALESCE(?, capacity),
                gpu_capacity = COALESCE(?, gpu_capacity)
            WHERE lab_id = ?
        `, [lab_name, capacity, gpu_capacity, id]);

        res.json({
            success: true,
            data: null,
            message: 'Lab updated successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteLab = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM lab WHERE lab_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Lab not found' });
        }

        res.json({
            success: true,
            data: null,
            message: 'Lab removed successfully'
        });
    } catch (err) {
        next(err);
    }
};
