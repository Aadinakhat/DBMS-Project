-- =====================================================================
-- AUTOMATIC LAB ALLOCATION SYSTEM
-- Relational Database Schema (MySQL 8) - Fully 3NF Normalized
-- =====================================================================

CREATE DATABASE IF NOT EXISTS lab_allocation_db;
USE lab_allocation_db;

-- ---------------------------------------------------------------------
-- TABLE DROPS (Reverse Dependency Order for clean setup)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS issue_report;
DROP TABLE IF EXISTS ad_hoc_request;
DROP TABLE IF EXISTS workstation_allocation;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS time_slot;
DROP TABLE IF EXISTS workstation;
DROP TABLE IF EXISTS course_software;
DROP TABLE IF EXISTS lab_software;
DROP TABLE IF EXISTS software;
DROP TABLE IF EXISTS lab_os;
DROP TABLE IF EXISTS operating_system;
DROP TABLE IF EXISTS lab;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS student_batch;
DROP TABLE IF EXISTS batch;
DROP TABLE IF EXISTS app_user;
DROP TABLE IF EXISTS department;

-- ---------------------------------------------------------------------
-- 1. DEPARTMENT
-- ---------------------------------------------------------------------
CREATE TABLE department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. APP_USER (Faculty, Students, Administrators)
-- ---------------------------------------------------------------------
CREATE TABLE app_user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'FACULTY', 'STUDENT') NOT NULL,
    dept_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_dept FOREIGN KEY (dept_id) 
        REFERENCES department(dept_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. BATCH (Academic student divisions, e.g., 'TE-COMP-A1')
-- ---------------------------------------------------------------------
CREATE TABLE batch (
    batch_id INT AUTO_INCREMENT PRIMARY KEY,
    batch_name VARCHAR(40) NOT NULL,
    dept_id INT NOT NULL,
    CONSTRAINT fk_batch_dept FOREIGN KEY (dept_id) 
        REFERENCES department(dept_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_dept_batch UNIQUE (dept_id, batch_name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. STUDENT_BATCH (Student to Batch 1:N mapping)
-- ---------------------------------------------------------------------
CREATE TABLE student_batch (
    student_id INT PRIMARY KEY,
    batch_id INT NOT NULL,
    CONSTRAINT fk_sb_student FOREIGN KEY (student_id) 
        REFERENCES app_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_sb_batch FOREIGN KEY (batch_id) 
        REFERENCES batch(batch_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. COURSE
-- ---------------------------------------------------------------------
CREATE TABLE course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(120) NOT NULL,
    dept_id INT NOT NULL,
    CONSTRAINT fk_course_dept FOREIGN KEY (dept_id) 
        REFERENCES department(dept_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. LAB (Physical computing laboratories)
-- ---------------------------------------------------------------------
CREATE TABLE lab (
    lab_id INT AUTO_INCREMENT PRIMARY KEY,
    lab_name VARCHAR(60) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    gpu_capacity INT NOT NULL DEFAULT 0,
    CONSTRAINT chk_lab_capacity CHECK (capacity > 0),
    CONSTRAINT chk_lab_gpu CHECK (gpu_capacity >= 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. OPERATING_SYSTEM (Separated for 1NF atomic attribute compliance)
-- ---------------------------------------------------------------------
CREATE TABLE operating_system (
    os_id INT AUTO_INCREMENT PRIMARY KEY,
    os_name VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. LAB_OS (Many-to-Many: Lab installed OS)
-- ---------------------------------------------------------------------
CREATE TABLE lab_os (
    lab_id INT NOT NULL,
    os_id INT NOT NULL,
    PRIMARY KEY (lab_id, os_id),
    CONSTRAINT fk_los_lab FOREIGN KEY (lab_id) 
        REFERENCES lab(lab_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_los_os FOREIGN KEY (os_id) 
        REFERENCES operating_system(os_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. SOFTWARE (Atomic catalog of software packages)
-- ---------------------------------------------------------------------
CREATE TABLE software (
    software_id INT AUTO_INCREMENT PRIMARY KEY,
    software_name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. LAB_SOFTWARE (Many-to-Many: Lab installed software)
-- ---------------------------------------------------------------------
CREATE TABLE lab_software (
    lab_id INT NOT NULL,
    software_id INT NOT NULL,
    PRIMARY KEY (lab_id, software_id),
    CONSTRAINT fk_lsoft_lab FOREIGN KEY (lab_id) 
        REFERENCES lab(lab_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_lsoft_software FOREIGN KEY (software_id) 
        REFERENCES software(software_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. COURSE_SOFTWARE (Many-to-Many: Course software prerequisites)
-- ---------------------------------------------------------------------
CREATE TABLE course_software (
    course_id INT NOT NULL,
    software_id INT NOT NULL,
    PRIMARY KEY (course_id, software_id),
    CONSTRAINT fk_csoft_course FOREIGN KEY (course_id) 
        REFERENCES course(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_csoft_software FOREIGN KEY (software_id) 
        REFERENCES software(software_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 12. WORKSTATION (Individual physical terminals inside a lab)
-- ---------------------------------------------------------------------
CREATE TABLE workstation (
    workstation_id INT AUTO_INCREMENT PRIMARY KEY,
    lab_id INT NOT NULL,
    station_number INT NOT NULL,
    status ENUM('ACTIVE', 'FAULTY', 'MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT chk_station_num CHECK (station_number > 0),
    CONSTRAINT fk_ws_lab FOREIGN KEY (lab_id) 
        REFERENCES lab(lab_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_lab_station UNIQUE (lab_id, station_number)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 13. TIME_SLOT (Weekly master timetable slots: 1=Mon, ..., 7=Sun)
-- ---------------------------------------------------------------------
CREATE TABLE time_slot (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week TINYINT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CONSTRAINT chk_day_of_week CHECK (day_of_week BETWEEN 1 AND 7),
    CONSTRAINT chk_slot_time CHECK (end_time > start_time),
    CONSTRAINT uq_day_time UNIQUE (day_of_week, start_time, end_time)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 14. SCHEDULE (Master recurring weekly lab allocation)
-- DB-Level Conflict Invariants:
--   - uq_lab_slot: No lab can have 2 simultaneous sessions
--   - uq_faculty_slot: No faculty can teach 2 sessions at once
--   - uq_batch_slot: No student batch can attend 2 sessions at once
-- ---------------------------------------------------------------------
CREATE TABLE schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    faculty_id INT NOT NULL,
    lab_id INT NOT NULL,
    slot_id INT NOT NULL,
    batch_id INT NOT NULL,
    session_type ENUM('PRACTICAL', 'EXAM', 'MAKEUP') NOT NULL DEFAULT 'PRACTICAL',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sched_course FOREIGN KEY (course_id) 
        REFERENCES course(course_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sched_faculty FOREIGN KEY (faculty_id) 
        REFERENCES app_user(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sched_lab FOREIGN KEY (lab_id) 
        REFERENCES lab(lab_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sched_slot FOREIGN KEY (slot_id) 
        REFERENCES time_slot(slot_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sched_batch FOREIGN KEY (batch_id) 
        REFERENCES batch(batch_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_lab_slot UNIQUE (lab_id, slot_id),
    CONSTRAINT uq_faculty_slot UNIQUE (faculty_id, slot_id),
    CONSTRAINT uq_batch_slot UNIQUE (batch_id, slot_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 15. WORKSTATION_ALLOCATION (Personalized student seat assignment)
-- ---------------------------------------------------------------------
CREATE TABLE workstation_allocation (
    schedule_id INT NOT NULL,
    student_id INT NOT NULL,
    workstation_id INT NOT NULL,
    allocated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (schedule_id, student_id),
    CONSTRAINT fk_wa_schedule FOREIGN KEY (schedule_id) 
        REFERENCES schedule(schedule_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_wa_student FOREIGN KEY (student_id) 
        REFERENCES app_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_wa_workstation FOREIGN KEY (workstation_id) 
        REFERENCES workstation(workstation_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_schedule_seat UNIQUE (schedule_id, workstation_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 16. AD_HOC_REQUEST (On-demand reservations for faculty/exams)
-- ---------------------------------------------------------------------
CREATE TABLE ad_hoc_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id INT NOT NULL,
    lab_id INT NOT NULL,
    slot_id INT NOT NULL,
    course_id INT NULL,
    request_date DATE NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    reason TEXT NULL,
    reviewed_by INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_adhoc_faculty FOREIGN KEY (faculty_id) 
        REFERENCES app_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_adhoc_lab FOREIGN KEY (lab_id) 
        REFERENCES lab(lab_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_adhoc_slot FOREIGN KEY (slot_id) 
        REFERENCES time_slot(slot_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_adhoc_course FOREIGN KEY (course_id) 
        REFERENCES course(course_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_adhoc_reviewer FOREIGN KEY (reviewed_by) 
        REFERENCES app_user(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 17. ISSUE_REPORT (Defect tracking for lab workstations)
-- ---------------------------------------------------------------------
CREATE TABLE issue_report (
    issue_id INT AUTO_INCREMENT PRIMARY KEY,
    reported_by INT NOT NULL,
    workstation_id INT NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    CONSTRAINT fk_issue_reporter FOREIGN KEY (reported_by) 
        REFERENCES app_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_issue_workstation FOREIGN KEY (workstation_id) 
        REFERENCES workstation(workstation_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 18. NOTIFICATION (Real-time student & faculty alert feed)
-- ---------------------------------------------------------------------
CREATE TABLE notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) 
        REFERENCES app_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 19. AUDIT_LOG (DBMS Auditing and Trigger Event Trail)
-- ---------------------------------------------------------------------
CREATE TABLE audit_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(40) NOT NULL,
    entity_name VARCHAR(40) NOT NULL,
    entity_id INT NOT NULL,
    performed_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    details TEXT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- PERFORMANCE & QUERY INDEXES
-- ---------------------------------------------------------------------
CREATE INDEX idx_user_role ON app_user(role);
CREATE INDEX idx_schedule_faculty ON schedule(faculty_id);
CREATE INDEX idx_schedule_course ON schedule(course_id);
CREATE INDEX idx_schedule_batch ON schedule(batch_id);
CREATE INDEX idx_adhoc_lookup ON ad_hoc_request(lab_id, slot_id, request_date, status);
CREATE INDEX idx_issue_workstation ON issue_report(workstation_id);
CREATE INDEX idx_notif_user_read ON notification(user_id, is_read);
CREATE INDEX idx_audit_time ON audit_log(timestamp);
