const baseUrl = 'http://localhost:5000/api';

async function runTests() {
    console.log('===========================================================');
    console.log(' VERIFYING: MASTER TIMETABLE ADD SESSIONS & DB LAB AVAILABILITY');
    console.log('===========================================================');

    let passed = 0;
    let failed = 0;

    async function test(name, fn) {
        try {
            await fn();
            console.log(`✅ [PASS] ${name}`);
            passed++;
        } catch (err) {
            console.error(`❌ [FAIL] ${name}: ${err.message}`);
            failed++;
        }
    }

    // 1. Missing slot_id returns 400
    await test('1. GET /labs/available without slot_id rejects with 400 Bad Request', async () => {
        const res = await fetch(`${baseUrl}/labs/available`);
        const data = await res.json();
        if (res.status !== 400 || data.success !== false) {
            throw new Error(`Expected 400 Bad Request, got ${res.status}`);
        }
    });

    // 2. Non-existent slot_id returns 404
    await test('2. GET /labs/available with non-existent slot_id returns 404 Not Found', async () => {
        const res = await fetch(`${baseUrl}/labs/available?slot_id=999999`);
        const data = await res.json();
        if (res.status !== 404 || data.success !== false) {
            throw new Error(`Expected 404 Not Found, got ${res.status}`);
        }
    });

    // 3. Slot 1 returns available labs excluding occupied ones
    let initialAvailableCount = 0;
    await test('3. GET /labs/available?slot_id=1 returns only free locations for Monday 09:00-10:00', async () => {
        const res = await fetch(`${baseUrl}/labs/available?slot_id=1`);
        const json = await res.json();
        if (!json.success || !Array.isArray(json.data)) {
            throw new Error('Expected success: true and data array');
        }
        initialAvailableCount = json.data.length;
        if (initialAvailableCount === 0) {
            throw new Error('Expected available labs to be > 0');
        }
        if (json.meta.occupiedCount !== 7) {
            throw new Error(`Expected 7 occupied labs for slot 1, got ${json.meta.occupiedCount}`);
        }

        // Verify that known booked labs for slot 1 are NOT in available data
        // Lab 12 (Room-101), Lab 20 (Room-701), Lab 24 (BEE-206)
        const bookedLabIds = [12, 20, 24, 11, 25];
        for (const labId of bookedLabIds) {
            const found = json.data.find(l => l.lab_id === labId);
            if (found) {
                throw new Error(`Booked lab ${labId} (${found.lab_name}) was incorrectly returned as available!`);
            }
        }
        console.log(`   -> Meta: ${json.meta.availableCount} available, ${json.meta.occupiedCount} occupied, ${json.meta.totalCount} total.`);
    });

    // 4. Overlapping 2-hour slot 3 (09:00 - 11:00) also excludes slot 1 and slot 2 sessions
    await test('4. GET /labs/available?slot_id=3 accounts for 2-hour overlapping sessions', async () => {
        const res = await fetch(`${baseUrl}/labs/available?slot_id=3`);
        const json = await res.json();
        if (!json.success || json.meta.occupiedCount < 7) {
            throw new Error('Expected 2-hour slot to detect all overlapping collisions');
        }
        console.log(`   -> Slot 3 meta: ${json.meta.availableCount} available, ${json.meta.occupiedCount} occupied.`);
    });

    // 5. Dynamic lifecycle: schedule a session on an available lab -> verify it disappears from available -> delete -> verify it reappears
    let newScheduleId = null;
    let chosenLab = null;
    await test('5. Schedule creation dynamically updates database availability in real time', async () => {
        // Pick the first available lab from slot 1
        const resAvail1 = await fetch(`${baseUrl}/labs/available?slot_id=1`);
        const jsonAvail1 = await resAvail1.json();
        chosenLab = jsonAvail1.data[0]; // e.g. CAED-001 or similar

        // Create a new session in this chosen lab on slot 1
        const createRes = await fetch(`${baseUrl}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 1, // Course 1
                faculty_id: 2, // Faculty 2
                lab_id: chosenLab.lab_id,
                slot_id: 1,
                batch_id: 2, // Batch 2 (FE-A2)
                session_type: 'PRACTICAL'
            })
        });
        const createJson = await createRes.json();
        if (!createJson.success || !createJson.data?.schedule_id) {
            throw new Error(`Schedule creation failed: ${createJson.message}`);
        }
        newScheduleId = createJson.data.schedule_id;
        console.log(`   -> Created temporary schedule #${newScheduleId} in lab '${chosenLab.lab_name}'`);

        // Check availability again: the chosen lab must NOT be available now!
        const resAvail2 = await fetch(`${baseUrl}/labs/available?slot_id=1`);
        const jsonAvail2 = await resAvail2.json();
        const stillInList = jsonAvail2.data.find(l => l.lab_id === chosenLab.lab_id);
        if (stillInList) {
            throw new Error(`Lab ${chosenLab.lab_name} is still visible in available locations after being scheduled!`);
        }
        if (jsonAvail2.data.length !== initialAvailableCount - 1) {
            throw new Error(`Expected available count to decrease from ${initialAvailableCount} to ${initialAvailableCount - 1}, got ${jsonAvail2.data.length}`);
        }
        console.log(`   -> Confirmed: Lab '${chosenLab.lab_name}' is now hidden from available locations.`);
    });

    // 6. Double booking prevention
    await test('6. Attempting to schedule the same lab on the same slot fails with 409 Conflict', async () => {
        const dupRes = await fetch(`${baseUrl}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 2,
                faculty_id: 5,
                lab_id: chosenLab.lab_id,
                slot_id: 1,
                batch_id: 4,
                session_type: 'PRACTICAL'
            })
        });
        const dupJson = await dupRes.json();
        if (dupRes.status !== 409 || dupJson.success !== false) {
            throw new Error(`Expected 409 Conflict, got ${dupRes.status}`);
        }
        console.log(`   -> Successfully rejected double booking: "${dupJson.message}"`);
    });

    // 7. Cleanup & Re-verification
    await test('7. Deleting session restores the lab to available locations list', async () => {
        if (newScheduleId) {
            const delRes = await fetch(`${baseUrl}/schedules/${newScheduleId}`, {
                method: 'DELETE'
            });
            const delJson = await delRes.json();
            if (!delJson.success) {
                throw new Error(`Failed to delete schedule: ${delJson.message}`);
            }

            // Verify lab is back in available list
            const resAvail3 = await fetch(`${baseUrl}/labs/available?slot_id=1`);
            const jsonAvail3 = await resAvail3.json();
            const backInList = jsonAvail3.data.find(l => l.lab_id === chosenLab.lab_id);
            if (!backInList) {
                throw new Error(`Lab ${chosenLab.lab_name} was not restored to available locations after schedule deletion`);
            }
            if (jsonAvail3.data.length !== initialAvailableCount) {
                throw new Error(`Expected available count to be restored to ${initialAvailableCount}, got ${jsonAvail3.data.length}`);
            }
            console.log(`   -> Lab '${chosenLab.lab_name}' successfully restored to available locations list.`);
        }
    });

    console.log('===========================================================');
    console.log(` RESULT: ${passed} PASSED, ${failed} FAILED`);
    console.log('===========================================================');
    if (failed > 0) process.exit(1);
    process.exit(0);
}

runTests().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
});
