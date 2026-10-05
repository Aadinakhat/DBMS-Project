-- =====================================================================
-- AUTOMATIC LAB ALLOCATION SYSTEM
-- Seed Data (Realistic sample data for multi-table queries & testing)
-- =====================================================================

USE lab_allocation_db;

-- ---------------------------------------------------------------------
-- 1. DEPARTMENTS
-- ---------------------------------------------------------------------
INSERT INTO department (dept_id, dept_name) VALUES
(1, 'Computer Engineering'),
(2, 'Information Technology'),
(3, 'Data Science and AI'),
(4, 'Electronics and Telecommunication');

-- ---------------------------------------------------------------------
-- 2. USERS (ADMIN, FACULTY, STUDENT)
-- ---------------------------------------------------------------------
INSERT INTO app_user (user_id, name, email, password_hash, role, dept_id) VALUES
-- Administrators
(1, 'Admin One', 'admin@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'ADMIN', 1),
(2, 'Lab Superintendent', 'labsuper@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'ADMIN', 1),

-- Faculty Members
(3, 'Prof. Mehta', 'mehta@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(4, 'Prof. Rao', 'rao@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(5, 'Dr. Sharma', 'sharma@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 3),
(6, 'Prof. Iyer', 'iyer@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),

-- Students
(7, 'Asha Patel', 'asha@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(8, 'Rohan Verma', 'rohan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(9, 'Sana Khan', 'sana@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(10, 'Vikram Deshmukh', 'vikram@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(11, 'Pooja Nair', 'pooja@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(12, 'Karan Malhotra', 'karan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(13, 'Neha Joshi', 'neha@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(14, 'Rahul Kulkarni', 'rahul@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(15, 'Ananya Sen', 'ananya@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 3),
(16, 'Kabir Bose', 'kabir@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 3),
(17, 'Divya Shinde', 'divya@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(18, 'Aditya Chawla', 'aditya@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(19, 'Priya Menon', 'priya@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 3),
(20, 'Aryan Kapoor', 'aryan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1);

-- ---------------------------------------------------------------------
-- 3. BATCHES
-- ---------------------------------------------------------------------
INSERT INTO batch (batch_id, batch_name, dept_id) VALUES
(1, 'TE-COMP-A1', 1),
(2, 'TE-COMP-A2', 1),
(3, 'TE-IT-B1', 2),
(4, 'TE-IT-B2', 2),
(5, 'BE-AI-C1', 3);

-- ---------------------------------------------------------------------
-- 4. STUDENT_BATCH
-- ---------------------------------------------------------------------
INSERT INTO student_batch (student_id, batch_id) VALUES
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 2),
(17, 2),
(20, 2),
(12, 3),
(13, 3),
(14, 4),
(18, 4),
(15, 5),
(16, 5),
(19, 5);

-- ---------------------------------------------------------------------
-- 5. COURSES
-- ---------------------------------------------------------------------
INSERT INTO course (course_id, course_code, course_name, dept_id) VALUES
(1, 'CS301', 'Database Management Systems', 1),
(2, 'CS302', 'Machine Learning', 1),
(3, 'CS303', 'Computer Networks', 1),
(4, 'IT304', 'Cloud Infrastructure & DevOps', 2),
(5, 'DS305', 'Big Data Engineering', 3),
(6, 'CS306', 'Operating Systems & Systems Lab', 1);

-- ---------------------------------------------------------------------
-- 6. LABS
-- ---------------------------------------------------------------------
INSERT INTO lab (lab_id, lab_name, capacity, gpu_capacity) VALUES
(1, 'Lab-101 (Systems Lab)', 30, 0),
(2, 'Lab-102 (Networks Lab)', 35, 0),
(3, 'AI-Lab (Deep Learning Suite)', 25, 16),
(4, 'Lab-104 (Database & Web Lab)', 30, 0),
(5, 'Lab-201 (Cloud Computing Lab)', 40, 4),
(6, 'IoT-Lab (Embedded Systems)', 20, 0);

-- ---------------------------------------------------------------------
-- 7. OPERATING SYSTEMS
-- ---------------------------------------------------------------------
INSERT INTO operating_system (os_id, os_name) VALUES
(1, 'Ubuntu 22.04 LTS'),
(2, 'Windows 11 Enterprise'),
(3, 'Fedora Workstation'),
(4, 'macOS Sonoma');

-- ---------------------------------------------------------------------
-- 8. LAB_OS
-- ---------------------------------------------------------------------
INSERT INTO lab_os (lab_id, os_id) VALUES
(1, 1), (1, 2),
(2, 1), (2, 2),
(3, 1),
(4, 1), (4, 2),
(5, 1), (5, 2),
(6, 1);

-- ---------------------------------------------------------------------
-- 9. SOFTWARE PACKAGES
-- ---------------------------------------------------------------------
INSERT INTO software (software_id, software_name) VALUES
(1, 'MySQL Server 8.0'),
(2, 'PostgreSQL 16'),
(3, 'Python 3.11'),
(4, 'CUDA Toolkit 12'),
(5, 'Wireshark'),
(6, 'Docker & Containerd'),
(7, 'TensorFlow & PyTorch'),
(8, 'Apache Spark'),
(9, 'Visual Studio Code'),
(10, 'Cisco Packet Tracer');

-- ---------------------------------------------------------------------
-- 10. LAB_SOFTWARE
-- ---------------------------------------------------------------------
INSERT INTO lab_software (lab_id, software_id) VALUES
(1, 1), (1, 3), (1, 9),
(2, 5), (2, 9), (2, 10),
(3, 3), (3, 4), (3, 7), (3, 9),
(4, 1), (4, 2), (4, 3), (4, 9),
(5, 1), (5, 3), (5, 6), (5, 8), (5, 9),
(6, 3), (6, 9);

-- ---------------------------------------------------------------------
-- 11. COURSE_SOFTWARE PREREQUISITES
-- ---------------------------------------------------------------------
INSERT INTO course_software (course_id, software_id) VALUES
(1, 1), (1, 9),         -- DBMS needs MySQL, VS Code
(2, 3), (2, 4), (2, 7), -- ML needs Python, CUDA, TensorFlow
(3, 5), (3, 10),        -- CN needs Wireshark, Packet Tracer
(4, 6), (4, 9),         -- Cloud needs Docker, VS Code
(5, 3), (5, 8),         -- Big Data needs Python, Spark
(6, 1), (6, 3);         -- OS needs MySQL, Python

-- ---------------------------------------------------------------------
-- 12. WORKSTATIONS (Physical lab machines)
-- ---------------------------------------------------------------------
INSERT INTO workstation (workstation_id, lab_id, station_number, status) VALUES
-- Lab-101 (Workstations 1-8)
(1, 1, 1, 'ACTIVE'),
(2, 1, 2, 'ACTIVE'),
(3, 1, 3, 'FAULTY'),
(4, 1, 4, 'ACTIVE'),
(5, 1, 5, 'ACTIVE'),
(6, 1, 6, 'ACTIVE'),
(7, 1, 7, 'MAINTENANCE'),
(8, 1, 8, 'ACTIVE'),

-- Lab-102 (Workstations 1-8)
(9, 2, 1, 'ACTIVE'),
(10, 2, 2, 'ACTIVE'),
(11, 2, 3, 'ACTIVE'),
(12, 2, 4, 'ACTIVE'),
(13, 2, 5, 'FAULTY'),
(14, 2, 6, 'ACTIVE'),
(15, 2, 7, 'ACTIVE'),
(16, 2, 8, 'ACTIVE'),

-- AI-Lab (Workstations 1-8, with GPUs)
(17, 3, 1, 'ACTIVE'),
(18, 3, 2, 'ACTIVE'),
(19, 3, 3, 'ACTIVE'),
(20, 3, 4, 'ACTIVE'),
(21, 3, 5, 'ACTIVE'),
(22, 3, 6, 'ACTIVE'),
(23, 3, 7, 'ACTIVE'),
(24, 3, 8, 'ACTIVE'),

-- Lab-104 (Workstations 1-8)
(25, 4, 1, 'ACTIVE'),
(26, 4, 2, 'ACTIVE'),
(27, 4, 3, 'ACTIVE'),
(28, 4, 4, 'ACTIVE'),
(29, 4, 5, 'ACTIVE'),
(30, 4, 6, 'FAULTY'),
(31, 4, 7, 'ACTIVE'),
(32, 4, 8, 'ACTIVE'),

-- Lab-201 (Workstations 1-6)
(33, 5, 1, 'ACTIVE'),
(34, 5, 2, 'ACTIVE'),
(35, 5, 3, 'ACTIVE'),
(36, 5, 4, 'ACTIVE'),
(37, 5, 5, 'ACTIVE'),
(38, 5, 6, 'ACTIVE'),

-- IoT-Lab (Workstations 1-5)
(39, 6, 1, 'ACTIVE'),
(40, 6, 2, 'ACTIVE'),
(41, 6, 3, 'ACTIVE'),
(42, 6, 4, 'ACTIVE'),
(43, 6, 5, 'ACTIVE');

-- ---------------------------------------------------------------------
-- 13. TIME SLOTS (1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday)
-- ---------------------------------------------------------------------
INSERT INTO time_slot (slot_id, day_of_week, start_time, end_time) VALUES
(1, 1, '09:00:00', '11:00:00'), -- Mon Slot 1
(2, 1, '11:15:00', '13:15:00'), -- Mon Slot 2
(3, 1, '14:00:00', '16:00:00'), -- Mon Slot 3
(4, 2, '09:00:00', '11:00:00'), -- Tue Slot 1
(5, 2, '11:15:00', '13:15:00'), -- Tue Slot 2
(6, 2, '14:00:00', '16:00:00'), -- Tue Slot 3
(7, 3, '09:00:00', '11:00:00'), -- Wed Slot 1
(8, 3, '11:15:00', '13:15:00'), -- Wed Slot 2
(9, 4, '09:00:00', '11:00:00'), -- Thu Slot 1
(10, 5, '09:00:00', '11:00:00'); -- Fri Slot 1

-- ---------------------------------------------------------------------
-- 14. SCHEDULE (Master recurring weekly lab timetable)
-- ---------------------------------------------------------------------
INSERT INTO schedule (schedule_id, course_id, faculty_id, lab_id, slot_id, batch_id, session_type) VALUES
(1, 1, 3, 4, 1, 1, 'PRACTICAL'), -- Mon 9am: Prof. Mehta, DBMS in Lab-104 for TE-COMP-A1
(2, 1, 3, 4, 2, 2, 'PRACTICAL'), -- Mon 11:15am: Prof. Mehta, DBMS in Lab-104 for TE-COMP-A2
(3, 2, 5, 3, 1, 5, 'PRACTICAL'), -- Mon 9am: Dr. Sharma, ML in AI-Lab for BE-AI-C1
(4, 3, 4, 2, 3, 1, 'PRACTICAL'), -- Mon 2pm: Prof. Rao, CN in Lab-102 for TE-COMP-A1
(5, 4, 6, 5, 4, 3, 'PRACTICAL'), -- Tue 9am: Prof. Iyer, Cloud in Lab-201 for TE-IT-B1
(6, 6, 3, 1, 5, 1, 'PRACTICAL'), -- Tue 11:15am: Prof. Mehta, OS in Lab-101 for TE-COMP-A1
(7, 5, 5, 3, 6, 5, 'PRACTICAL'), -- Tue 2pm: Dr. Sharma, Big Data in AI-Lab for BE-AI-C1
(8, 3, 4, 2, 7, 4, 'PRACTICAL'), -- Wed 9am: Prof. Rao, CN in Lab-102 for TE-IT-B2
(9, 1, 3, 4, 9, 1, 'EXAM'),      -- Thu 9am: Prof. Mehta, DBMS Lab Exam in Lab-104 for TE-COMP-A1
(10, 4, 6, 5, 10, 4, 'PRACTICAL'); -- Fri 9am: Prof. Iyer, Cloud in Lab-201 for TE-IT-B2

-- ---------------------------------------------------------------------
-- 15. WORKSTATION ALLOCATION (Student seat assignments per session)
-- ---------------------------------------------------------------------
INSERT INTO workstation_allocation (schedule_id, student_id, workstation_id) VALUES
-- Schedule 1: Lab-104 (Workstations 25, 26, 27, 28) for Batch 1 (Students 7, 8, 9, 10)
(1, 7, 25),
(1, 8, 26),
(1, 9, 27),
(1, 10, 28),

-- Schedule 3: AI-Lab (Workstations 17, 18, 19) for Batch 5 (Students 15, 16, 19)
(3, 15, 17),
(3, 16, 18),
(3, 19, 19),

-- Schedule 4: Lab-102 (Workstations 9, 10, 11, 12) for Batch 1 (Students 7, 8, 9, 10)
(4, 7, 9),
(4, 8, 10),
(4, 9, 11),
(4, 10, 12);

-- ---------------------------------------------------------------------
-- 16. AD_HOC_REQUESTS (On-demand requests)
-- Note: Request dates align with slot weekdays:
-- Slot 4 (Tue) -> 2026-10-13 (Tuesday)
-- Slot 8 (Wed) -> 2026-10-14 (Wednesday)
-- Slot 10 (Fri) -> 2026-10-16 (Friday)
-- ---------------------------------------------------------------------
INSERT INTO ad_hoc_request (request_id, faculty_id, lab_id, slot_id, course_id, request_date, status, reason, reviewed_by) VALUES
(1, 3, 1, 4, 1, '2026-10-13', 'APPROVED', 'Supplementary SQL indexing workshop', 1),
(2, 5, 3, 8, 2, '2026-10-14', 'PENDING', 'Additional GPU time for neural net training batch', NULL),
(3, 4, 2, 4, 3, '2026-10-13', 'REJECTED', 'Packet trace demo (conflicted with maintenance)', 1),
(4, 6, 5, 10, 4, '2026-10-16', 'PENDING', 'Docker swarm cluster practical revision', NULL),
(5, 3, 4, 4, 1, '2026-10-13', 'APPROVED', 'Special practical session for database performance', 1),
(6, 5, 3, 4, 2, '2026-10-13', 'CANCELLED', 'Faculty unavailable due to conference', NULL);

-- ---------------------------------------------------------------------
-- 17. ISSUE REPORTS (Workstation defects)
-- ---------------------------------------------------------------------
INSERT INTO issue_report (issue_id, reported_by, workstation_id, description, status) VALUES
(1, 3, 3, 'Monitor display flickers constantly and HDMI cable loose', 'OPEN'),
(2, 4, 13, 'Network NIC not obtaining IP address from DHCP server', 'IN_PROGRESS'),
(3, 5, 30, 'Key switches on mechanical keyboard sticky and non-responsive', 'OPEN'),
(4, 7, 3, 'Power supply turns off intermittently after 10 minutes', 'OPEN'),
(5, 8, 7, 'RAM failure on boot, system showing BIOS beep codes', 'IN_PROGRESS'),
(6, 15, 17, 'CUDA driver version mismatch resolved with update', 'RESOLVED');

-- ---------------------------------------------------------------------
-- 18. NOTIFICATIONS
-- ---------------------------------------------------------------------
INSERT INTO notification (notification_id, user_id, message, is_read) VALUES
(1, 7, 'Your DBMS Practical is confirmed in Lab-104 at Station #25 on Mondays 9:00 AM', TRUE),
(2, 8, 'Seat Allocation Update: Assigned Station #26 for CS301', TRUE),
(3, 3, 'Your ad-hoc reservation for Lab-101 on 2026-10-13 has been APPROVED by Administrator', FALSE),
(4, 4, 'Your ad-hoc reservation for Lab-102 was REJECTED due to scheduled hardware maintenance', TRUE),
(5, 15, 'AI Lab seat assigned: Workstation #17 for Deep Learning practical', FALSE),
(6, 16, 'AI Lab seat assigned: Workstation #18 for Deep Learning practical', FALSE),
(7, 1, 'New defect ticket logged for Workstation #3 in Lab-101', FALSE),
(8, 5, 'Ad-hoc request #2 for AI-Lab submitted and pending administrative approval', FALSE);

-- ---------------------------------------------------------------------
-- 19. AUDIT LOG INITIALIZATION
-- Note: Triggers on schedule and issue_report have already populated live audit events.
-- We append a baseline setup milestone:
-- ---------------------------------------------------------------------
INSERT INTO audit_log (action_type, entity_name, entity_id, performed_by, details) VALUES
('DATABASE_INITIALIZED', 'system', 0, 'SETUP_SCRIPT', 'Database schema, seed data, and DBMS constraints initialized successfully');

