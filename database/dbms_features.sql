-- =====================================================================
-- AUTOMATIC LAB ALLOCATION SYSTEM
-- Advanced DBMS Features: Views, Stored Procedures, Functions, Triggers
-- =====================================================================

USE lab_allocation_db;

-- ---------------------------------------------------------------------
-- 1. VIEWS
-- ---------------------------------------------------------------------

-- View 1: Joined personalized student timetable
DROP VIEW IF EXISTS vw_student_timetable;
CREATE VIEW vw_student_timetable AS
SELECT 
    sb.student_id,
    u.name AS student_name,
    t.day_of_week,
    CASE t.day_of_week
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
        WHEN 7 THEN 'Sunday'
    END AS day_name,
    t.start_time,
    t.end_time,
    c.course_code,
    c.course_name,
    l.lab_name,
    w.station_number,
    f.name AS faculty_name,
    b.batch_name,
    s.session_type,
    s.schedule_id
FROM student_batch sb
JOIN app_user u ON u.user_id = sb.student_id
JOIN schedule s ON s.batch_id = sb.batch_id
JOIN course c ON c.course_id = s.course_id
JOIN lab l ON l.lab_id = s.lab_id
JOIN time_slot t ON t.slot_id = s.slot_id
JOIN app_user f ON f.user_id = s.faculty_id
JOIN batch b ON b.batch_id = s.batch_id
LEFT JOIN workstation_allocation wa 
    ON wa.schedule_id = s.schedule_id AND wa.student_id = sb.student_id
LEFT JOIN workstation w 
    ON w.workstation_id = wa.workstation_id;

-- View 2: Full Master Timetable for Admin
DROP VIEW IF EXISTS vw_master_schedule;
CREATE VIEW vw_master_schedule AS
SELECT 
    s.schedule_id,
    s.course_id,
    c.course_code,
    c.course_name,
    s.faculty_id,
    f.name AS faculty_name,
    s.lab_id,
    l.lab_name,
    s.batch_id,
    b.batch_name,
    s.slot_id,
    t.day_of_week,
    CASE t.day_of_week
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
        WHEN 7 THEN 'Sunday'
    END AS day_name,
    t.start_time,
    t.end_time,
    s.session_type,
    s.created_at
FROM schedule s
JOIN course c ON c.course_id = s.course_id
JOIN app_user f ON f.user_id = s.faculty_id
JOIN lab l ON l.lab_id = s.lab_id
JOIN time_slot t ON t.slot_id = s.slot_id
JOIN batch b ON b.batch_id = s.batch_id;

-- View 3: Weekly Lab Utilization Summary
DROP VIEW IF EXISTS vw_lab_utilization;
CREATE VIEW vw_lab_utilization AS
SELECT 
    l.lab_id,
    l.lab_name,
    l.capacity,
    l.gpu_capacity,
    COUNT(s.schedule_id) AS booked_slots,
    (SELECT COUNT(*) FROM time_slot) AS total_available_slots,
    ROUND(
        (COUNT(s.schedule_id) * 100.0) / NULLIF((SELECT COUNT(*) FROM time_slot), 0), 
        2
    ) AS utilization_percentage
FROM lab l
LEFT JOIN schedule s ON s.lab_id = l.lab_id
GROUP BY l.lab_id, l.lab_name, l.capacity, l.gpu_capacity;

-- View 4: Lab Hardware & Terminal Health Status
DROP VIEW IF EXISTS vw_lab_health_status;
CREATE VIEW vw_lab_health_status AS
SELECT 
    l.lab_id,
    l.lab_name,
    l.capacity,
    COUNT(w.workstation_id) AS total_workstations,
    SUM(CASE WHEN w.status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_workstations,
    SUM(CASE WHEN w.status = 'FAULTY' THEN 1 ELSE 0 END) AS faulty_workstations,
    SUM(CASE WHEN w.status = 'MAINTENANCE' THEN 1 ELSE 0 END) AS maintenance_workstations,
    ROUND(
        (SUM(CASE WHEN w.status = 'ACTIVE' THEN 1 ELSE 0 END) * 100.0) / 
        NULLIF(COUNT(w.workstation_id), 0), 
        1
    ) AS usable_percentage
FROM lab l
LEFT JOIN workstation w ON w.lab_id = l.lab_id
GROUP BY l.lab_id, l.lab_name, l.capacity;


-- ---------------------------------------------------------------------
-- 2. STORED FUNCTIONS
-- ---------------------------------------------------------------------

DROP FUNCTION IF EXISTS fn_check_lab_availability;
DELIMITER //
CREATE FUNCTION fn_check_lab_availability(
    p_lab_id INT, 
    p_slot_id INT, 
    p_date DATE
) 
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_is_available BOOLEAN DEFAULT TRUE;
    DECLARE v_master_conflict INT DEFAULT 0;
    DECLARE v_adhoc_conflict INT DEFAULT 0;

    -- Check clash with master timetable
    SELECT COUNT(*) INTO v_master_conflict
    FROM schedule
    WHERE lab_id = p_lab_id AND slot_id = p_slot_id;

    IF v_master_conflict > 0 THEN
        RETURN FALSE;
    END IF;

    -- Check clash with approved ad-hoc reservations
    SELECT COUNT(*) INTO v_adhoc_conflict
    FROM ad_hoc_request
    WHERE lab_id = p_lab_id 
      AND slot_id = p_slot_id 
      AND request_date = p_date 
      AND status = 'APPROVED';

    IF v_adhoc_conflict > 0 THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END //
DELIMITER ;

DROP FUNCTION IF EXISTS fn_get_lab_utilization_pct;
DELIMITER //
CREATE FUNCTION fn_get_lab_utilization_pct(p_lab_id INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_booked INT DEFAULT 0;
    DECLARE v_total INT DEFAULT 0;
    DECLARE v_pct DECIMAL(5,2) DEFAULT 0.00;

    SELECT COUNT(*) INTO v_booked FROM schedule WHERE lab_id = p_lab_id;
    SELECT COUNT(*) INTO v_total FROM time_slot;

    IF v_total > 0 THEN
        SET v_pct = ROUND((v_booked * 100.0) / v_total, 2);
    END IF;

    RETURN v_pct;
END //
DELIMITER ;


-- ---------------------------------------------------------------------
-- 3. STORED PROCEDURES (With ACID Transactions & Error Handling)
-- ---------------------------------------------------------------------

DROP PROCEDURE IF EXISTS sp_approve_ad_hoc_request;
DELIMITER //
CREATE PROCEDURE sp_approve_ad_hoc_request(
    IN p_request_id INT,
    IN p_admin_id INT
)
proc_label: BEGIN
    DECLARE v_faculty_id INT;
    DECLARE v_lab_id INT;
    DECLARE v_slot_id INT;
    DECLARE v_req_date DATE;
    DECLARE v_curr_status VARCHAR(20);
    DECLARE v_slot_day INT;
    DECLARE v_conflict_count INT DEFAULT 0;

    -- Transaction rollback handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1. Fetch request details with lock
    SELECT faculty_id, lab_id, slot_id, request_date, status
    INTO v_faculty_id, v_lab_id, v_slot_id, v_req_date, v_curr_status
    FROM ad_hoc_request
    WHERE request_id = p_request_id
    FOR UPDATE;

    IF v_faculty_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Ad-hoc request not found';
    END IF;

    IF v_curr_status != 'PENDING' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Only PENDING requests can be approved';
    END IF;

    -- 2. Verify weekday match: MySQL WEEKDAY() returns 0 for Mon -> add 1 for 1=Mon
    SELECT day_of_week INTO v_slot_day
    FROM time_slot
    WHERE slot_id = v_slot_id;

    IF (WEEKDAY(v_req_date) + 1) != v_slot_day THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Validation Error: Request date day of week does not match the chosen slot weekday';
    END IF;

    -- 3. Verify collision against master timetable
    SELECT COUNT(*) INTO v_conflict_count
    FROM schedule
    WHERE lab_id = v_lab_id AND slot_id = v_slot_id;

    IF v_conflict_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Conflict Error: Lab is already reserved in Master Timetable for this time slot';
    END IF;

    -- 4. Verify collision against other approved ad-hoc bookings
    SELECT COUNT(*) INTO v_conflict_count
    FROM ad_hoc_request
    WHERE lab_id = v_lab_id 
      AND slot_id = v_slot_id 
      AND request_date = v_req_date 
      AND status = 'APPROVED'
      AND request_id != p_request_id;

    IF v_conflict_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Conflict Error: Lab already booked by another approved ad-hoc request for this date/slot';
    END IF;

    -- 5. Atomically update request status
    UPDATE ad_hoc_request
    SET status = 'APPROVED',
        reviewed_by = p_admin_id
    WHERE request_id = p_request_id;

    -- 6. Insert notification for requesting faculty
    INSERT INTO notification (user_id, message)
    VALUES (
        v_faculty_id,
        CONCAT('Your ad-hoc booking #', p_request_id, ' for Lab ID ', v_lab_id, ' on ', v_req_date, ' was APPROVED.')
    );

    -- 7. Audit log
    INSERT INTO audit_log (action_type, entity_name, entity_id, performed_by, details)
    VALUES (
        'ADHOC_APPROVED',
        'ad_hoc_request',
        p_request_id,
        CONCAT('Admin ID: ', p_admin_id),
        CONCAT('Approved reservation for Lab ', v_lab_id, ' on ', v_req_date)
    );

    COMMIT;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_allocate_student_seats;
DELIMITER //
CREATE PROCEDURE sp_allocate_student_seats(
    IN p_schedule_id INT
)
BEGIN
    DECLARE v_lab_id INT;
    DECLARE v_batch_id INT;
    DECLARE v_student_count INT DEFAULT 0;
    DECLARE v_workstation_count INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT lab_id, batch_id INTO v_lab_id, v_batch_id
    FROM schedule
    WHERE schedule_id = p_schedule_id;

    IF v_lab_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Schedule record not found';
    END IF;

    SELECT COUNT(*) INTO v_student_count
    FROM student_batch
    WHERE batch_id = v_batch_id;

    SELECT COUNT(*) INTO v_workstation_count
    FROM workstation
    WHERE lab_id = v_lab_id AND status = 'ACTIVE';

    IF v_student_count > v_workstation_count THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient active workstations in lab to accommodate all students in batch';
    END IF;

    -- Remove any prior allocations for this schedule
    DELETE FROM workstation_allocation WHERE schedule_id = p_schedule_id;

    -- Pair batch students with available active workstations sequentially
    INSERT INTO workstation_allocation (schedule_id, student_id, workstation_id)
    SELECT 
        p_schedule_id,
        s_ranked.student_id,
        w_ranked.workstation_id
    FROM (
        SELECT student_id, ROW_NUMBER() OVER (ORDER BY student_id) AS row_num
        FROM student_batch
        WHERE batch_id = v_batch_id
    ) s_ranked
    JOIN (
        SELECT workstation_id, ROW_NUMBER() OVER (ORDER BY station_number) AS row_num
        FROM workstation
        WHERE lab_id = v_lab_id AND status = 'ACTIVE'
    ) w_ranked ON s_ranked.row_num = w_ranked.row_num;

    -- Audit log
    INSERT INTO audit_log (action_type, entity_name, entity_id, performed_by, details)
    VALUES (
        'SEATS_ALLOCATED',
        'schedule',
        p_schedule_id,
        'SYSTEM',
        CONCAT('Allocated seats for ', v_student_count, ' students in schedule #', p_schedule_id)
    );

    COMMIT;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_book_ad_hoc_slot;
DELIMITER //
CREATE PROCEDURE sp_book_ad_hoc_slot(
    IN p_faculty_id INT,
    IN p_lab_id INT,
    IN p_slot_id INT,
    IN p_course_id INT,
    IN p_request_date DATE,
    IN p_reason TEXT,
    OUT p_request_id INT
)
BEGIN
    DECLARE v_slot_day INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT day_of_week INTO v_slot_day
    FROM time_slot
    WHERE slot_id = p_slot_id;

    IF v_slot_day IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid time slot ID';
    END IF;

    IF (WEEKDAY(p_request_date) + 1) != v_slot_day THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Request date does not fall on the time slot weekday';
    END IF;

    INSERT INTO ad_hoc_request (
        faculty_id, lab_id, slot_id, course_id, request_date, status, reason
    ) VALUES (
        p_faculty_id, p_lab_id, p_slot_id, p_course_id, p_request_date, 'PENDING', p_reason
    );

    SET p_request_id = LAST_INSERT_ID();

    INSERT INTO audit_log (action_type, entity_name, entity_id, performed_by, details)
    VALUES (
        'ADHOC_REQUEST_CREATED',
        'ad_hoc_request',
        p_request_id,
        CONCAT('Faculty ID: ', p_faculty_id),
        CONCAT('Requested Lab ', p_lab_id, ' on ', p_request_date)
    );

    COMMIT;
END //
DELIMITER ;


-- ---------------------------------------------------------------------
-- 4. TRIGGERS
-- ---------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_adhoc_before_approve;
DELIMITER //
CREATE TRIGGER trg_adhoc_before_approve
BEFORE UPDATE ON ad_hoc_request
FOR EACH ROW
BEGIN
    DECLARE v_slot_day INT;
    DECLARE v_master_conflict INT DEFAULT 0;
    DECLARE v_adhoc_conflict INT DEFAULT 0;

    IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
        -- Check weekday consistency
        SELECT day_of_week INTO v_slot_day 
        FROM time_slot 
        WHERE slot_id = NEW.slot_id;

        IF (WEEKDAY(NEW.request_date) + 1) != v_slot_day THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Trigger Violation: Request date weekday does not match the time slot day';
        END IF;

        -- Check collision with master timetable
        SELECT COUNT(*) INTO v_master_conflict
        FROM schedule
        WHERE lab_id = NEW.lab_id AND slot_id = NEW.slot_id;

        IF v_master_conflict > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Trigger Violation: Lab is already occupied in Master Timetable for this slot';
        END IF;

        -- Check collision with another approved ad-hoc request
        SELECT COUNT(*) INTO v_adhoc_conflict
        FROM ad_hoc_request
        WHERE lab_id = NEW.lab_id 
          AND slot_id = NEW.slot_id 
          AND request_date = NEW.request_date 
          AND status = 'APPROVED'
          AND request_id != NEW.request_id;

        IF v_adhoc_conflict > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Trigger Violation: Another approved booking already exists for this lab, slot, and date';
        END IF;
    END IF;
END //
DELIMITER ;


DROP TRIGGER IF EXISTS trg_schedule_after_insert_audit;
DELIMITER //
CREATE TRIGGER trg_schedule_after_insert_audit
AFTER INSERT ON schedule
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (action_type, entity_name, entity_id, performed_by, details)
    VALUES (
        'SCHEDULE_CREATED',
        'schedule',
        NEW.schedule_id,
        'SYSTEM',
        CONCAT('Scheduled Course ', NEW.course_id, ' in Lab ', NEW.lab_id, ' for Batch ', NEW.batch_id, ' at Slot ', NEW.slot_id)
    );
END //
DELIMITER ;


DROP TRIGGER IF EXISTS trg_issue_after_insert_workstation;
DELIMITER //
CREATE TRIGGER trg_issue_after_insert_workstation
AFTER INSERT ON issue_report
FOR EACH ROW
BEGIN
    -- Automatically mark the affected workstation as FAULTY
    UPDATE workstation 
    SET status = 'FAULTY' 
    WHERE workstation_id = NEW.workstation_id;

    -- Audit log the incident
    INSERT INTO audit_log (action_type, entity_name, entity_id, performed_by, details)
    VALUES (
        'ISSUE_REPORTED',
        'workstation',
        NEW.workstation_id,
        CONCAT('User ID ', NEW.reported_by),
        CONCAT('Defect logged: ', NEW.description)
    );
END //
DELIMITER ;
