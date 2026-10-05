const db = require('../db');

exports.listNotifications = async (req, res, next) => {
    try {
        const { user_id } = req.query;
        let sql = `
            SELECT 
                n.notification_id,
                n.user_id,
                u.name AS user_name,
                n.message,
                n.is_read,
                n.created_at
            FROM notification n
            JOIN app_user u ON u.user_id = n.user_id
            WHERE 1=1
        `;
        const params = [];

        if (user_id) {
            sql += ' AND n.user_id = ?';
            params.push(parseInt(user_id, 10));
        }

        sql += ' ORDER BY n.created_at DESC LIMIT 50';

        const [rows] = await db.query(sql, params);

        res.json({
            success: true,
            data: rows,
            message: 'Notifications retrieved'
        });
    } catch (err) {
        next(err);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE notification SET is_read = TRUE WHERE notification_id = ?', [id]);

        res.json({
            success: true,
            data: null,
            message: 'Notification marked as read'
        });
    } catch (err) {
        next(err);
    }
};
