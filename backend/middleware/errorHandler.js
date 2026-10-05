/**
 * Central Error Handling Middleware
 * Surfaces raw MySQL database constraint violations with human-readable explanations
 * perfect for demonstrating database invariants in viva examination.
 */

function errorHandler(err, req, res, next) {
    console.error(`[Error] ${req.method} ${req.url}:`, err);

    let statusCode = 500;
    let userMessage = err.message || 'An unexpected internal error occurred';
    let errorType = 'INTERNAL_ERROR';

    // 1. MySQL Custom TRIGGER / PROCEDURE SIGNAL Exception (SQLSTATE 45000)
    if (err.sqlState === '45000' || err.code === 'ER_SIGNAL_EXCEPTION') {
        statusCode = 422; // Unprocessable Entity
        errorType = 'TRIGGER_CONSTRAINT_VIOLATION';
        userMessage = err.sqlMessage || err.message;
    }
    // 2. MySQL Duplicate Key / Unique Constraint Violation (Error 1062)
    else if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        statusCode = 409; // Conflict
        errorType = 'DUPLICATE_KEY_VIOLATION';
        if (err.sqlMessage && err.sqlMessage.includes('uq_lab_slot')) {
            userMessage = 'Database Conflict: Lab is already booked for this specific time slot.';
        } else if (err.sqlMessage && err.sqlMessage.includes('uq_faculty_slot')) {
            userMessage = 'Database Conflict: Faculty member is already scheduled for another lab at this time slot.';
        } else if (err.sqlMessage && err.sqlMessage.includes('uq_batch_slot')) {
            userMessage = 'Database Conflict: Student batch is already scheduled for another session at this time slot.';
        } else if (err.sqlMessage && err.sqlMessage.includes('uq_schedule_seat')) {
            userMessage = 'Database Conflict: Workstation is already assigned to another student in this session.';
        } else {
            userMessage = `Database Conflict: Duplicate record violates UNIQUE constraint: ${err.sqlMessage}`;
        }
    }
    // 3. MySQL Foreign Key Constraint Violation (Error 1451: Cannot delete referenced row)
    else if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
        statusCode = 409; // Conflict
        errorType = 'FOREIGN_KEY_RESTRICT_VIOLATION';
        userMessage = 'Referential Integrity Error: Cannot delete or update this record because it is referenced by other active tables (RESTRICT constraint).';
    }
    // 4. MySQL Foreign Key Constraint Violation (Error 1452: Referenced parent key does not exist)
    else if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.errno === 1452) {
        statusCode = 400; // Bad Request
        errorType = 'FOREIGN_KEY_NOT_FOUND_VIOLATION';
        userMessage = 'Referential Integrity Error: One or more referenced IDs do not exist in the parent table.';
    }
    // 5. MySQL CHECK Constraint Violation (Error 3819)
    else if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED' || err.errno === 3819) {
        statusCode = 400; // Bad Request
        errorType = 'CHECK_CONSTRAINT_VIOLATION';
        userMessage = `Database Domain Error: Value violated table CHECK constraint: ${err.sqlMessage}`;
    }
    // 6. Generic DB connection failure
    else if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
        statusCode = 503;
        errorType = 'DATABASE_OFFLINE';
        userMessage = 'Could not connect to MySQL Server. Please check if the MySQL service is running.';
    }

    return res.status(statusCode).json({
        success: false,
        data: null,
        message: userMessage,
        details: {
            code: err.code || 'UNKNOWN',
            errno: err.errno,
            sqlState: err.sqlState,
            errorType
        }
    });
}

module.exports = errorHandler;
