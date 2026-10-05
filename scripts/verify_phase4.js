const db = require('../backend/db');

async function runComprehensiveVerification() {
    console.log('===========================================================');
    console.log(' PHASE 4: COMPREHENSIVE INTEGRATION & DBMS VERIFICATION');
    console.log('===========================================================');

    const baseUrl = 'http://localhost:5000/api';
    let passed = 0;
    let failed = 0;

    async function check(testName, fn) {
        try {
            await fn();
            console.log(`✅ [PASS] ${testName}`);
            passed++;
        } catch (err) {
            console.error(`❌ [FAIL] ${testName}: ${err.message}`);
            failed++;
        }
    }

    // -------------------------------------------------------------
    // TEST 1: DUPLICATE INSERT (UNIQUE CONSTRAINT / DOUBLE-BOOKING)
    // -------------------------------------------------------------
    await check('1.1: Reject Lab Double-Booking (uq_lab_slot)', async () => {
        // Schedule 1 already exists on lab 4, slot 1
        const res = await fetch(`${baseUrl}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 2,
                faculty_id: 4,
                lab_id: 4,
                slot_id: 1, // Taken!
                batch_id: 3,
                session_type: 'PRACTICAL'
            })
        });
        const data = await res.json();
        if (res.status !== 409 || !data.message.includes('Lab is already booked')) {
            throw new Error(`Expected 409 Conflict with friendly message, got ${res.status}: ${data.message}`);
        }
    });

    await check('1.2: Reject Faculty Double-Booking (uq_faculty_slot)', async () => {
        // Schedule 1 has faculty 3 (Prof. Mehta) on slot 1
        const res = await fetch(`${baseUrl}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 2,
                faculty_id: 3, // Prof. Mehta already busy at slot 1!
                lab_id: 1,
                slot_id: 1,
                batch_id: 3,
                session_type: 'PRACTICAL'
            })
        });
        const data = await res.json();
        if (res.status !== 409 || !data.message.includes('Faculty member is already scheduled')) {
            throw new Error(`Expected 409 Conflict for faculty clash, got ${res.status}: ${data.message}`);
        }
    });

    // -------------------------------------------------------------
    // TEST 2: FOREIGN KEY CONSTRAINT VIOLATIONS
    // -------------------------------------------------------------
    await check('2.1: Reject Non-Existent Foreign Key on Insert', async () => {
        const res = await fetch(`${baseUrl}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 999999, // Non-existent course
                faculty_id: 3,
                lab_id: 1,
                slot_id: 8,
                batch_id: 1,
                session_type: 'PRACTICAL'
            })
        });
        const data = await res.json();
        if (res.status !== 400 || data.details?.errorType !== 'FOREIGN_KEY_NOT_FOUND_VIOLATION') {
            throw new Error(`Expected 400 FOREIGN_KEY_NOT_FOUND_VIOLATION, got ${res.status}: ${data.message}`);
        }
    });

    await check('2.2: Reject Deletion of Referenced Row (ON DELETE RESTRICT)', async () => {
        // Lab 4 is referenced in Schedule 1, 2, 9
        const res = await fetch(`${baseUrl}/labs/4`, { method: 'DELETE' });
        const data = await res.json();
        if (res.status !== 409 || data.details?.errorType !== 'FOREIGN_KEY_RESTRICT_VIOLATION') {
            throw new Error(`Expected 409 FOREIGN_KEY_RESTRICT_VIOLATION, got ${res.status}: ${data.message}`);
        }
    });

    // -------------------------------------------------------------
    // TEST 3: CHECK CONSTRAINT VIOLATION
    // -------------------------------------------------------------
    await check('3.1: Enforce CHECK constraint on lab capacity (capacity > 0)', async () => {
        let threw = false;
        try {
            await db.query(`
                INSERT INTO lab (lab_name, capacity, gpu_capacity)
                VALUES ('Illegal Lab', -10, 0);
            `);
        } catch (err) {
            threw = true;
            if (err.code !== 'ER_CHECK_CONSTRAINT_VIOLATED' && !err.message.includes('chk_lab_capacity')) {
                throw new Error(`Expected CHECK constraint failure, got: ${err.message}`);
            }
        }
        if (!threw) throw new Error('Query succeeded but should have violated CHECK constraint');
    });

    await check('3.2: Enforce CHECK constraint on time_slot (end_time > start_time)', async () => {
        let threw = false;
        try {
            await db.query(`
                INSERT INTO time_slot (day_of_week, start_time, end_time)
                VALUES (5, '14:00:00', '13:00:00');
            `);
        } catch (err) {
            threw = true;
            if (err.code !== 'ER_CHECK_CONSTRAINT_VIOLATED' && !err.message.includes('chk_slot_time')) {
                throw new Error(`Expected CHECK constraint failure, got: ${err.message}`);
            }
        }
        if (!threw) throw new Error('Query succeeded but should have violated CHECK constraint');
    });

    // -------------------------------------------------------------
    // TEST 4: TRIGGER FIRING VERIFICATION
    // -------------------------------------------------------------
    await check('4.1: Trigger trg_issue_after_insert_workstation fires and updates workstation to FAULTY', async () => {
        // Ensure workstation 2 is currently ACTIVE
        await db.query(`UPDATE workstation SET status = 'ACTIVE' WHERE workstation_id = 2;`);

        // Insert issue report
        const res = await fetch(`${baseUrl}/issues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reported_by: 3,
                workstation_id: 2,
                description: 'Phase 4 verification: Motherboard capacitors leaking'
            })
        });
        const data = await res.json();
        if (!data.success) throw new Error(`Issue insertion failed: ${data.message}`);

        // Verify status in DB
        const [[ws]] = await db.query(`SELECT status FROM workstation WHERE workstation_id = 2;`);
        if (ws.status !== 'FAULTY') {
            throw new Error(`Trigger failed: expected workstation status 'FAULTY', got '${ws.status}'`);
        }

        // Verify audit log entry created by trigger
        const [[audit]] = await db.query(`
            SELECT * FROM audit_log 
            WHERE entity_name = 'workstation' AND entity_id = 2 AND action_type = 'ISSUE_REPORTED'
            ORDER BY log_id DESC LIMIT 1;
        `);
        if (!audit) throw new Error('Trigger did not create audit_log record for ISSUE_REPORTED');
    });

    await check('4.2: Trigger trg_schedule_after_insert_audit records schedule creation event', async () => {
        // Find an empty slot/lab combination
        const [[freeSlot]] = await db.query(`
            SELECT t.slot_id, l.lab_id 
            FROM time_slot t, lab l
            WHERE NOT EXISTS (SELECT 1 FROM schedule s WHERE s.lab_id = l.lab_id AND s.slot_id = t.slot_id)
            LIMIT 1;
        `);

        if (freeSlot) {
            const [insertRes] = await db.query(`
                INSERT INTO schedule (course_id, faculty_id, lab_id, slot_id, batch_id, session_type)
                VALUES (1, 6, ?, ?, 3, 'PRACTICAL');
            `, [freeSlot.lab_id, freeSlot.slot_id]);

            const newSchedId = insertRes.insertId;

            const [[audit]] = await db.query(`
                SELECT * FROM audit_log 
                WHERE entity_name = 'schedule' AND entity_id = ? AND action_type = 'SCHEDULE_CREATED';
            `, [newSchedId]);

            // Clean up test schedule
            await db.query(`DELETE FROM schedule WHERE schedule_id = ?`, [newSchedId]);

            if (!audit) throw new Error('Trigger trg_schedule_after_insert_audit did not write audit log');
        }
    });

    // -------------------------------------------------------------
    // TEST 5: STORED PROCEDURE ROLLBACK ON FAILURE
    // -------------------------------------------------------------
    await check('5.1: sp_approve_ad_hoc_request rolls back cleanly on master schedule collision', async () => {
        // Create an ad-hoc request that targets lab 4 on slot 1 (which clashes with Master Schedule 1)
        // Note: Slot 1 is Monday. 2026-10-12 is Monday.
        const [reqResult] = await db.query(`
            INSERT INTO ad_hoc_request (faculty_id, lab_id, slot_id, course_id, request_date, status, reason)
            VALUES (4, 4, 1, 1, '2026-10-12', 'PENDING', 'Intentional collision test');
        `);
        const testReqId = reqResult.insertId;

        // Try to approve it via API
        const res = await fetch(`${baseUrl}/ad-hoc/${testReqId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin_id: 1 })
        });
        const data = await res.json();

        // Must fail with 422 or 400 and state transaction error
        if (res.status === 200) {
            throw new Error('Procedure should have failed due to master timetable collision, but returned 200 OK!');
        }

        // Verify that the request is STILL PENDING (transaction rolled back completely!)
        const [[reqRow]] = await db.query(`SELECT status FROM ad_hoc_request WHERE request_id = ?`, [testReqId]);
        if (reqRow.status !== 'PENDING') {
            throw new Error(`Transaction rollback failed: status changed to '${reqRow.status}' instead of remaining 'PENDING'`);
        }

        // Verify no notification was committed
        const [notifs] = await db.query(`
            SELECT * FROM notification WHERE message LIKE ?;
        `, [`%#${testReqId}%`]);
        if (notifs.length > 0) {
            throw new Error('Transaction rollback failed: notification was written despite rollback!');
        }

        // Clean up test ad-hoc request
        await db.query(`DELETE FROM ad_hoc_request WHERE request_id = ?`, [testReqId]);
    });

    // -------------------------------------------------------------
    // TEST 6: PREDEFINED SHOWCASE QUERIES EXECUTION
    // -------------------------------------------------------------
    await check('6.1: All predefined viva showcase queries execute without SQL errors', async () => {
        const queriesRes = await fetch(`${baseUrl}/dbms/queries`);
        const queriesData = await queriesRes.json();

        for (const q of queriesData.data) {
            const execRes = await fetch(`${baseUrl}/dbms/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ queryId: q.id })
            });
            const execData = await execRes.json();
            if (!execData.success) {
                throw new Error(`Showcase query '${q.id}' failed: ${execData.message}`);
            }
        }
    });

    // -------------------------------------------------------------
    // TEST 7: EMPTY DATA RESILIENCE
    // -------------------------------------------------------------
    await check('7.1: Frontend endpoints return clean empty arrays without crashing when no records match', async () => {
        const emptyFilterRes = await fetch(`${baseUrl}/schedules?search=NonExistentKeywordXYZ999`);
        const data = await emptyFilterRes.json();
        if (!data.success || !Array.isArray(data.data) || data.data.length !== 0) {
            throw new Error('Failed empty filter check');
        }
    });

    console.log('===========================================================');
    console.log(` SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('===========================================================');

    if (failed > 0) {
        process.exit(1);
    }
}

runComprehensiveVerification()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
