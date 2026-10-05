const db = require('../db');

exports.listAuditLogs = async (req, res, next) => {
    try {
        const { action_type, limit = 50, page = 1 } = req.query;
        let sql = `
            SELECT log_id, action_type, entity_name, entity_id, performed_by, details, timestamp
            FROM audit_log
            WHERE 1=1
        `;
        const params = [];

        if (action_type) {
            sql += ' AND action_type = ?';
            params.push(action_type);
        }

        sql += ' ORDER BY log_id DESC LIMIT ? OFFSET ?';
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        params.push(parseInt(limit, 10), offset);

        const [rows] = await db.query(sql, params);

        res.json({
            success: true,
            data: rows,
            message: 'Audit logs retrieved'
        });
    } catch (err) {
        next(err);
    }
};
