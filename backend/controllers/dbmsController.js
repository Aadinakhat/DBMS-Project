const db = require('../db');
const showcaseQueries = require('../queries/showcaseQueries');

exports.getShowcaseQueries = (req, res) => {
    // Return metadata without internal functions
    const list = showcaseQueries.map(q => ({
        id: q.id,
        name: q.name,
        concept: q.concept,
        description: q.description,
        sql: q.sql,
        defaultParams: q.defaultParams
    }));

    res.json({
        success: true,
        data: list,
        message: 'Showcase DBMS queries retrieved'
    });
};

exports.executeShowcaseQuery = async (req, res, next) => {
    try {
        const { queryId } = req.body;
        const queryItem = showcaseQueries.find(q => q.id === queryId);

        if (!queryItem) {
            return res.status(404).json({
                success: false,
                message: `Predefined query '${queryId}' not found. Arbitrary SQL execution is strictly prevented for security.`
            });
        }

        const params = req.body.params && Array.isArray(req.body.params) && req.body.params.length > 0
            ? req.body.params
            : queryItem.defaultParams;

        const startTime = Date.now();
        const [rows, fields] = await db.query(queryItem.sql, params);
        const executionTimeMs = Date.now() - startTime;

        // Extract column definitions
        const columns = fields ? fields.map(f => f.name) : (rows.length > 0 ? Object.keys(rows[0]) : []);

        res.json({
            success: true,
            data: {
                queryId: queryItem.id,
                name: queryItem.name,
                concept: queryItem.concept,
                sql: queryItem.sql,
                params,
                columns,
                rows,
                rowCount: rows.length,
                executionTimeMs
            },
            message: `Executed '${queryItem.name}' successfully in ${executionTimeMs}ms`
        });
    } catch (err) {
        next(err);
    }
};
