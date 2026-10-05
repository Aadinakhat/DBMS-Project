const db = require('../db');

exports.listIssues = async (req, res, next) => {
    try {
        const { status, lab_id } = req.query;
        let sql = `
            SELECT 
                i.issue_id,
                i.reported_by,
                u.name AS reporter_name,
                i.workstation_id,
                w.station_number,
                w.lab_id,
                l.lab_name,
                i.description,
                i.status,
                i.reported_at,
                i.resolved_at
            FROM issue_report i
            JOIN app_user u ON u.user_id = i.reported_by
            JOIN workstation w ON w.workstation_id = i.workstation_id
            JOIN lab l ON l.lab_id = w.lab_id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            sql += ' AND i.status = ?';
            params.push(status);
        }
        if (lab_id) {
            sql += ' AND w.lab_id = ?';
            params.push(parseInt(lab_id, 10));
        }

        sql += ' ORDER BY i.reported_at DESC';

        const [rows] = await db.query(sql, params);

        res.json({
            success: true,
            data: rows,
            message: 'Issues retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.createIssue = async (req, res, next) => {
    try {
        const { reported_by, workstation_id, description } = req.body;

        if (!reported_by || !workstation_id || !description) {
            return res.status(400).json({ success: false, message: 'Reporter, Workstation ID, and Description are required' });
        }

        // Trigger trg_issue_after_insert_workstation will automatically mark workstation FAULTY
        // and record an event in audit_log
        const [result] = await db.query(`
            INSERT INTO issue_report (reported_by, workstation_id, description, status)
            VALUES (?, ?, ?, 'OPEN')
        `, [reported_by, workstation_id, description]);

        res.status(201).json({
            success: true,
            data: { issue_id: result.insertId },
            message: 'Issue reported. Workstation marked as FAULTY automatically by Database Trigger!'
        });
    } catch (err) {
        next(err);
    }
};

exports.updateIssueStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid issue status' });
        }

        const isResolved = status === 'RESOLVED';
        const resolvedAt = isResolved ? new Date() : null;

        await db.query(`
            UPDATE issue_report
            SET status = ?, resolved_at = ?
            WHERE issue_id = ?
        `, [status, resolvedAt, id]);

        // If marked RESOLVED, restore workstation to ACTIVE
        if (isResolved) {
            const [[issue]] = await db.query('SELECT workstation_id FROM issue_report WHERE issue_id = ?', [id]);
            if (issue) {
                await db.query(`UPDATE workstation SET status = 'ACTIVE' WHERE workstation_id = ?`, [issue.workstation_id]);
                await db.query(`
                    INSERT INTO audit_log (action_type, entity_name, entity_id, performed_by, details)
                    VALUES ('ISSUE_RESOLVED', 'workstation', ?, 'ADMIN', CONCAT('Issue #', ?, ' resolved. Restored to ACTIVE.'))
                `, [issue.workstation_id, id]);
            }
        }

        res.json({
            success: true,
            data: null,
            message: `Issue updated to ${status}`
        });
    } catch (err) {
        next(err);
    }
};
