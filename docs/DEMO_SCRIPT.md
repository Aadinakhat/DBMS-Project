# 7-Minute Viva Demonstration Script
## Automatic Lab Allocation System

---

### Minute 0:00 – 1:00 | Architecture & Relational Schema (3NF)
**Goal:** Establish that the project is built around database correctness, not just UI.
1. **Open the browser at:** `http://localhost:3000`
2. **Navigate to:** `ER Diagram & Schema` (`/schema`)
3. **Presenter Dialogue:**
   > *"Good morning professors. This is the Automatic Lab Allocation System. The star of this project is MySQL 8.0 running in InnoDB engine. We decomposed all multi-valued attributes like installed software and operating systems into 1NF, eliminated partial key dependencies in 2NF, and purged transitive dependencies in 3NF across 19 base tables. For instance, `system_count` was eliminated from `lab` because it is an aggregate derivable via `COUNT(workstation)`."*

---

### Minute 1:00 – 2:15 | Master Timetable & Constraint Conflict Guard
**Goal:** Demonstrate DB-level concurrency and integrity constraints.
1. **Navigate to:** `Master Timetable` (`/schedules`)
2. **Action:** Click **"Add Session"**.
3. **Trigger intentional conflict:**
   - Select Course: `CS302 - Machine Learning`
   - Select Faculty: `Prof. Mehta`
   - Select Lab: `Lab-104 (Database & Web Lab)`
   - Select Slot: `Monday 09:00 - 11:00` (Slot 1)
   - Click **"Create Session"**
4. **Observation:**
   - The UI immediately surfaces a red alert:
     `Database Conflict: Lab is already booked for this specific time slot.`
5. **Presenter Dialogue:**
   > *"Notice that this check was not performed in JavaScript code. It is enforced by MySQL table constraint `CONSTRAINT uq_lab_slot UNIQUE (lab_id, slot_id)`. Two concurrent users can never double-book a venue, completely eliminating race conditions."*

---

### Minute 2:15 – 3:30 | Stored Procedure & Auto-Seat Allocation
**Goal:** Demonstrate encapsulated database routines and window functions.
1. **Navigate to:** `Master Timetable` (`/schedules`)
2. **Find:** Schedule session #2 (`DBMS in Lab-104 for TE-COMP-A2`)
3. **Action:** Click the button **"Auto-Allocate (SP)"** on the row.
4. **Observation:**
   - Toast popup confirms: `Successfully allocated workstations for 3 students via Stored Procedure`.
   - The button transforms into `3 Seats (View)`.
   - Click `3 Seats (View)` to see students sequentially paired with active workstations.
5. **Presenter Dialogue:**
   > *"This invoked Stored Procedure `sp_allocate_student_seats(schedule_id)`. It executes inside an ACID transaction on MySQL, fetches active terminals using `ROW_NUMBER() OVER (ORDER BY station_number)` and pairs them with enrolled students. If terminals are insufficient, it raises an exception and rolls back."*

---

### Minute 3:30 – 4:30 | Ad-Hoc Booking & ACID Transaction Approval
**Goal:** Demonstrate row locks (`FOR UPDATE`), procedure triggers, and rollback.
1. **Navigate to:** `Ad-Hoc Bookings` (`/ad-hoc`)
2. **Observe table:**
   - Show request #2: `Pending extra GPU session` by Dr. Sharma for `AI-Lab`.
   - Note the Conflict Status badge showing `SLOT CLEAR`.
3. **Action:** Click **"Approve (SP)"**.
4. **Observation:**
   - Status updates atomically to `APPROVED`.
   - Open Bell icon in top navbar: notice the instant notification delivered to Dr. Sharma.
5. **Presenter Dialogue:**
   > *"Under the hood, `sp_approve_ad_hoc_request` placed an exclusive lock on the row with `SELECT ... FOR UPDATE`, validated the weekday against `WEEKDAY(request_date) + 1`, verified that no master schedule or approved reservation clashed, updated the status, sent a notification, and inserted an audit trail inside a single atomic `COMMIT`."*

---

### Minute 4:30 – 5:30 | Database Triggers in Action (Hardware Defect)
**Goal:** Show active `AFTER INSERT` triggers modifying related tables without application glue code.
1. **Navigate to:** `Defect Tracker` (`/issues`)
2. **Action:** Click **"Report Hardware Issue"**.
   - Select Reporter: `Prof. Mehta`
   - Select Lab: `Lab-101 (Systems Lab)`
   - Select Workstation: `Station #1 (Currently: ACTIVE)`
   - Description: `Power button jammed and monitor cable shorted`
   - Click **"Log Defect (Fires Trigger)"**
3. **Navigate to:** `Labs & Workstations` (`/labs`) -> Click **"Manage Workstations"** on `Lab-101`.
4. **Observation:**
   - Station #1 has automatically turned **`FAULTY`**.
5. **Navigate to:** `Triggers & Audit Log` (`/audit-log`).
   - Notice the newest row: `ISSUE_REPORTED` for Workstation #1 logged by trigger `trg_issue_after_insert_workstation`.
6. **Presenter Dialogue:**
   > *"The application server executed a single `INSERT INTO issue_report`. The MySQL engine trigger automatically changed the workstation relation to `FAULTY` and appended an immutable record into `audit_log`."*

---

### Minute 5:30 – 6:45 | The Core Viva Console (Predefined Showcase Queries)
**Goal:** Hit the heavy DBMS query concepts: Relational Division, Subqueries, HAVING.
1. **Navigate to:** `DBMS Concepts Showcase` (`/dbms-showcase`)
2. **Execute Query Q4 (Relational Division):**
   - Click **"Run Query"** on `Relational Division (All Software Requirement)`.
   - Explain the double `NOT EXISTS`: Finding laboratories that satisfy 100% of software prerequisites for Course CS302 (Machine Learning: Python, CUDA, TensorFlow). Output: `AI-Lab`.
3. **Execute Query Q6 (HAVING + Nested Subquery Aggregate):**
   - Click **"Run Query"** on `Labs Used More Than Average`.
   - Explain: Finds labs hosting strictly more sessions than `(SELECT AVG(count) FROM (SELECT COUNT(*) ...))`.
4. **Execute Query Q2 (Database View):**
   - Click **"Run Query"** on `Master Timetable via Database View`.
   - Explain: Demonstrates querying `vw_master_schedule` which abstracts a 6-table inner join.

---

### Minute 6:45 – 7:00 | Conclusion & Q&A
**Presenter Dialogue:**
> *"To summarize: every main entity supports full CRUD; constraints protect data at the relational layer; stored procedures handle complex workflows; triggers enforce auditability; and queries use raw, explainable SQL. We are now ready for your questions."*
