// Comprehensive automated verification test for backend API

async function runTests() {
    const baseUrl = 'http://localhost:5000/api';
    console.log('Testing Backend API at:', baseUrl);

    let pass = 0;
    let fail = 0;

    async function test(name, fn) {
        try {
            await fn();
            console.log(`✅ [PASS] ${name}`);
            pass++;
        } catch (err) {
            console.error(`❌ [FAIL] ${name}:`, err.message);
            fail++;
        }
    }

    // 1. Health check
    await test('Health check endpoint', async () => {
        const res = await fetch(`${baseUrl}/health`);
        const json = await res.json();
        if (!json.success || json.status !== 'HEALTHY') throw new Error('Unhealthy status');
    });

    // 2. Dashboard summary
    await test('Dashboard summary with aggregates', async () => {
        const res = await fetch(`${baseUrl}/dashboard/summary`);
        const json = await res.json();
        if (!json.success || !json.data.stats.total_labs) throw new Error('Missing stats');
        if (!json.data.utilizationData || json.data.utilizationData.length === 0) throw new Error('Missing utilization data');
    });

    // 3. List schedules
    await test('List schedules with joins', async () => {
        const res = await fetch(`${baseUrl}/schedules`);
        const json = await res.json();
        if (!json.success || json.data.length === 0) throw new Error('No schedules returned');
    });

    // 4. List labs
    await test('List labs with software & OS catalog', async () => {
        const res = await fetch(`${baseUrl}/labs`);
        const json = await res.json();
        if (!json.success || json.data.length === 0) throw new Error('No labs returned');
    });

    // 5. Predefined Showcase Queries List
    await test('Get Showcase DBMS Queries', async () => {
        const res = await fetch(`${baseUrl}/dbms/queries`);
        const json = await res.json();
        if (!json.success || json.data.length < 10) throw new Error('Expected at least 10 showcase queries');
    });

    // 6. Execute Showcase Query Q4 (Relational Division)
    await test('Execute Q4 Relational Division (Double NOT EXISTS)', async () => {
        const res = await fetch(`${baseUrl}/dbms/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ queryId: 'q4-relational-division-course-software' })
        });
        const json = await res.json();
        if (!json.success || !json.data.rows) throw new Error('Q4 execution failed: ' + json.message);
    });

    // 7. Duplicate Key Constraint Check (Prevent Double-Booking)
    await test('Unique Constraint: Reject double-booking (uq_lab_slot)', async () => {
        // Schedule 1 exists on lab 4, slot 1
        const res = await fetch(`${baseUrl}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 2,
                faculty_id: 4,
                lab_id: 4, // Lab 4
                slot_id: 1, // Slot 1 already taken by Schedule 1!
                batch_id: 3,
                session_type: 'PRACTICAL'
            })
        });
        const json = await res.json();
        if (res.status !== 409 || json.success !== false) {
            throw new Error(`Expected 409 Conflict, got ${res.status}`);
        }
        if (!json.message.includes('Lab is already booked')) {
            throw new Error(`Expected friendly message, got: ${json.message}`);
        }
    });

    // 8. Foreign Key Violation Check
    await test('Foreign Key Constraint: Reject non-existent course_id', async () => {
        const res = await fetch(`${baseUrl}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 99999, // Invalid course ID
                faculty_id: 3,
                lab_id: 1,
                slot_id: 10,
                batch_id: 1,
                session_type: 'PRACTICAL'
            })
        });
        const json = await res.json();
        if (res.status !== 400 || json.success !== false) {
            throw new Error(`Expected 400 Bad Request, got ${res.status}`);
        }
    });

    // 9. Stored Procedure: Seat allocation
    await test('Stored Procedure: sp_allocate_student_seats', async () => {
        const res = await fetch(`${baseUrl}/schedules/1/allocate-seats`, {
            method: 'POST'
        });
        const json = await res.json();
        if (!json.success || json.data.length === 0) throw new Error('Seat allocation procedure failed');
    });

    // 10. Database Trigger Verification: Issue Report -> Workstation status becomes FAULTY
    await test('Database Trigger: trg_issue_after_insert_workstation sets status FAULTY', async () => {
        // Report defect on Workstation 1 (Lab 1)
        const res = await fetch(`${baseUrl}/issues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reported_by: 3,
                workstation_id: 1,
                description: 'Network cable clip broken and intermittent packet drops'
            })
        });
        const json = await res.json();
        if (!json.success) throw new Error('Issue creation failed: ' + json.message);

        // Check if Workstation 1 status became FAULTY in DB
        const wsRes = await fetch(`${baseUrl}/workstations?lab_id=1`);
        const wsJson = await wsRes.json();
        const ws1 = wsJson.data.find(w => w.workstation_id === 1);
        if (!ws1 || ws1.status !== 'FAULTY') {
            throw new Error(`Expected workstation status to be FAULTY, found: ${ws1?.status}`);
        }
    });

    console.log(`\nVerification Complete: ${pass} passed, ${fail} failed.`);
    if (fail > 0) process.exit(1);
}

runTests().catch(err => {
    console.error('Test run failed:', err);
    process.exit(1);
});
