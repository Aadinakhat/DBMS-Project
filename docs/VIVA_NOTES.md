# Comprehensive DBMS Viva Examination Notes & Answers
## Automatic Lab Allocation System

This document maps classic academic DBMS viva questions directly to our codebase, schema, triggers, and stored procedures.

---

### Q1: In which normal form is your database designed? Prove 3NF.
**Answer:**
Our schema is normalized to **Third Normal Form (3NF)**:
1. **1NF (Atomic Attributes):** In legacy systems, software packages and operating systems are stored as comma-delimited strings (e.g. `'Python, MySQL'`). We split them into discrete catalog tables (`software`, `operating_system`) and many-to-many bridge tables (`lab_software`, `course_software`, `lab_os`). All attribute values are atomic scalar values.
2. **2NF (No Partial Dependencies):** In associative tables with composite primary keys like `workstation_allocation(schedule_id, student_id)` and `lab_software(lab_id, software_id)`, there are zero non-key attributes depending on only part of the primary key. Student names and lab names reside exclusively in their respective single-key parent tables.
3. **3NF (No Transitive Dependencies):** No non-key attribute depends on another non-key attribute ($X \to Y$ where $Y \to Z$). For example, `system_count` was intentionally removed from `lab` because it is an aggregate derivable via `COUNT(workstation)` on `workstation.lab_id`. Storing it would cause update/deletion anomalies.

---

### Q2: How does your system prevent race conditions and double-bookings?
**Answer:**
We do NOT rely on application-level checks, which are susceptible to race conditions when two HTTP requests arrive concurrently. Instead, conflict detection is guaranteed at the **database engine level** using multi-column `UNIQUE` constraints in table `schedule`:
- `CONSTRAINT uq_lab_slot UNIQUE (lab_id, slot_id)`: Guarantees that two concurrent transactions attempting to book the same room at the same time cannot both succeed; MySQL rejects the second with error `ER_DUP_ENTRY (1062)`.
- `CONSTRAINT uq_faculty_slot UNIQUE (faculty_id, slot_id)`: Prevents faculty scheduling clashes.
- `CONSTRAINT uq_batch_slot UNIQUE (batch_id, slot_id)`: Prevents batch timetable clashes.
- For ad-hoc requests, concurrency is resolved via row-level locks (`SELECT ... FOR UPDATE`) and ACID transactions in `sp_approve_ad_hoc_request`.

---

### Q3: What is the difference between ON DELETE CASCADE, RESTRICT, and SET NULL? Where are they used in your project?
**Answer:**
- **`ON DELETE CASCADE`:** When the parent record is deleted, all matching child rows are automatically removed.
  - *Used in:* `workstation_allocation` references `schedule(schedule_id) ON DELETE CASCADE`. If a timetable session is cancelled, all seat allocations for that session are purged automatically.
- **`ON DELETE RESTRICT`:** Prevents deletion of the parent record if any child record references it.
  - *Used in:* `schedule` references `lab(lab_id) ON DELETE RESTRICT` and `course(course_id) ON DELETE RESTRICT`. A laboratory or course that is part of an active master timetable cannot be deleted by mistake.
- **`ON DELETE SET NULL`:** Sets the foreign key column in child rows to `NULL` when parent is deleted.
  - *Used in:* `app_user` references `department(dept_id) ON DELETE SET NULL`. If a department is reorganized, the user account remains intact.

---

### Q4: What is Relational Division? Where is it implemented in your project?
**Answer:**
**Relational Division ($R \div S$)** answers universal quantification queries: *"Find entities in $R$ that are associated with ALL elements in $S$."*
In our system, Query **Q4** in `showcaseQueries.js` implements Relational Division using a double `NOT EXISTS` query:
```sql
SELECT l.lab_id, l.lab_name
FROM lab l
WHERE NOT EXISTS (
    SELECT cs.software_id 
    FROM course_software cs
    WHERE cs.course_id = 2  -- Course: Machine Learning
      AND NOT EXISTS (
          SELECT 1 FROM lab_software ls
          WHERE ls.lab_id = l.lab_id AND ls.software_id = cs.software_id
      )
);
```
**Explanation:** It finds laboratories $l$ where there does *not* exist any software required by Course 2 that is *not* installed in lab $l$. If a course requires `{Python, CUDA, TensorFlow}`, only `AI-Lab` matches.

---

### Q5: What is the difference between a Stored Procedure and a Stored Function?
**Answer:**
| Feature | Stored Procedure (`sp_*`) | Stored Function (`fn_*`) |
| :--- | :--- | :--- |
| **Return Value** | Does not return a value directly (uses `OUT` parameters or result sets). | Must return a single scalar value via `RETURNS <type>`. |
| **Transactions** | Can manage transactions (`START TRANSACTION`, `COMMIT`, `ROLLBACK`). | Cannot execute transaction control statements (`COMMIT`/`ROLLBACK`). |
| **Invocation** | Invoked using `CALL sp_name(...)`. | Invoked inside SQL expressions: `SELECT fn_name(...)`. |
| **Our Project Examples** | `sp_approve_ad_hoc_request`, `sp_allocate_student_seats`. | `fn_check_lab_availability`, `fn_get_lab_utilization_pct`. |

---

### Q6: How do ACID properties work in `sp_approve_ad_hoc_request`?
**Answer:**
- **Atomicity:** `START TRANSACTION` wraps the approval check, status update, faculty notification insertion, and audit trail logging. If any check fails, `ROLLBACK` undoes all modifications.
- **Consistency:** Validates that `WEEKDAY(request_date) + 1` matches `slot.day_of_week`, and verifies that the room is not already booked in `schedule`.
- **Isolation:** Uses `SELECT ... FOR UPDATE` to place an exclusive write lock on the ad-hoc request row, preventing other concurrent admin approvals from reading dirty data.
- **Durability:** Upon `COMMIT`, all state changes are permanently written to InnoDB redo logs.

---

### Q7: What are Database Triggers? Explain the triggers used in your system.
**Answer:**
A trigger is a set of SQL statements that automatically execute in response to an `INSERT`, `UPDATE`, or `DELETE` event on a table.
We have 3 active triggers in `dbms_features.sql`:
1. **`trg_issue_after_insert_workstation` (`AFTER INSERT ON issue_report`):**
   - Automatically executes `UPDATE workstation SET status = 'FAULTY'` whenever a user reports an issue.
   - Automatically appends a defect audit record into `audit_log`.
2. **`trg_schedule_after_insert_audit` (`AFTER INSERT ON schedule`):**
   - Automatically records a `SCHEDULE_CREATED` event into `audit_log` with details of course, lab, and time slot.
3. **`trg_adhoc_before_approve` (`BEFORE UPDATE ON ad_hoc_request`):**
   - Validates that the request date day of week matches the time slot.
   - Raises `SIGNAL SQLSTATE '45000'` if the lab is already occupied in the master timetable or another approved ad-hoc request.

---

### Q8: What is a Database View? Why did you use views?
**Answer:**
A **Database View** is a stored SQL query that acts as a virtual table. It does not store physical data; whenever queried, the underlying `SELECT` statement executes.
**Benefits in our system:**
- **Query Simplification:** `vw_master_schedule` encapsulates a 6-table `INNER JOIN`, allowing the frontend and reporting queries to write simple `SELECT * FROM vw_master_schedule`.
- **Pre-computed Aggregates:** `vw_lab_utilization` calculates real-time booking percentages using `COUNT(s.schedule_id) * 100.0 / total_slots`.
- **Hardware Health Monitoring:** `vw_lab_health_status` computes operational workstation percentages using conditional sums: `SUM(CASE WHEN status='ACTIVE' THEN 1 ELSE 0 END)`.

---

### Q9: Why did you create B-Tree Indexes on specific columns?
**Answer:**
While Primary Keys and UNIQUE constraints are automatically indexed as Clustered Indexes and Unique Indexes, we added secondary B-Tree indexes on frequently filtered and joined columns:
- `CREATE INDEX idx_schedule_faculty ON schedule(faculty_id)`: Speeds up faculty timetable lookups from $O(N)$ table scans to $O(\log N)$ index range lookups.
- `CREATE INDEX idx_adhoc_lookup ON ad_hoc_request(lab_id, slot_id, request_date, status)`: Composite index enabling instant conflict collision checks during approval transactions.
- `CREATE INDEX idx_notif_user_read ON notification(user_id, is_read)`: Optimizes unread notification polling for students and faculty.

---

### Q10: What is the difference between WHERE and HAVING?
**Answer:**
- **`WHERE`:** Filters individual rows *before* any grouping or aggregate functions are calculated. (e.g. `WHERE student_id = 7`).
- **`HAVING`:** Filters groups *after* aggregation has taken place using aggregate functions like `COUNT()`, `SUM()`, `AVG()`.
- **Project Example (Query Q6 & Q8):**
  ```sql
  SELECT f.name, COUNT(s.schedule_id) AS sessions
  FROM app_user f
  JOIN schedule s ON s.faculty_id = f.user_id
  GROUP BY f.user_id, f.name
  HAVING COUNT(s.schedule_id) >= 2;
  ```
  `HAVING` filters only for faculty members who teach 2 or more laboratory sessions per week.
