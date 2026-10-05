const db = require('../db');

exports.listWorkstations = async (req, res, next) => {
    try {
        const { lab_id, status } = req.query;
        let sql = `
            SELECT 
                w.workstation_id,
                w.lab_id,
                l.lab_name,
                w.station_number,
                w.status,
                (SELECT COUNT(*) FROM issue_report i WHERE i.workstation_id = w.workstation_id AND i.status <> 'RESOLVED') AS open_issues_count
            FROM workstation w
            JOIN lab l ON l.lab_id = w.lab_id
            WHERE 1=1
        `;
        const params = [];

        if (lab_id) {
            sql += ' AND w.lab_id = ?';
            params.push(parseInt(lab_id, 10));
        }
        if (status) {
            sql += ' AND w.status = ?';
            params.push(status);
        }

        sql += ' ORDER BY w.lab_id, w.station_number';

        const [rows] = await db.query(sql, params);

        res.json({
            success: true,
            data: rows,
            message: 'Workstations retrieved'
        });
    } catch (err) {
        next(err);
    }
};

exports.updateWorkstation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, message: 'Status is required' });
        }

        await db.query(`
            UPDATE workstation 
            SET status = ? 
            WHERE workstation_id = ?
        `, [status, id]);

        res.json({
            success: true,
            data: null,
            message: `Workstation #${id} status updated to ${status}`
        });
    } catch (err) {
        next(err);
    }
};

exports.createWorkstation = async (req, res, next) => {
    try {
        const { lab_id, station_number, status = 'ACTIVE' } = req.body;

        if (!lab_id || !station_number) {
            return res.status(400).json({ success: false, message: 'Lab ID and Station Number are required' });
        }

        const [result] = await db.query(`
            INSERT INTO workstation (lab_id, station_number, status)
            VALUES (?, ?, ?)
        `, [lab_id, station_number, status]);

        res.status(201).json({
            success: true,
            data: { workstation_id: result.insertId },
            message: 'Workstation created successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteWorkstation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM workstation WHERE workstation_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Workstation not found' });
        }

        res.json({
            success: true,
            data: null,
            message: 'Workstation removed'
        });
    } catch (err) {
        next(err);
    }
};
