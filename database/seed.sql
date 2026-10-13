-- =====================================================================
-- AUTOMATIC LAB ALLOCATION SYSTEM
-- Seed Data: Sardar Patel Institute of Technology (SPIT)
-- First Year Engineering (FE) - Divisions A, B, C, D (Sem-I, AY 2026-27)
-- =====================================================================

USE lab_allocation_db;

-- ---------------------------------------------------------------------
-- 1. DEPARTMENTS
-- ---------------------------------------------------------------------
INSERT INTO department (dept_id, dept_name) VALUES
(1, 'Applied Sciences Mathematics Humanities Department'),
(2, 'Computer Engineering'),
(3, 'Electronics and Telecommunication');

-- ---------------------------------------------------------------------
-- 2. APP_USER (Administrators, Faculty, Students)
-- ---------------------------------------------------------------------
INSERT INTO app_user (user_id, name, email, password_hash, role, dept_id) VALUES
-- System Administrators
(1, 'Admin One', 'admin@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'ADMIN', 1),
(2, 'Lab Superintendent', 'labsuper@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'ADMIN', 1),

-- Faculty Members (CAED, EC, IPL, DSM, IC, PC, EE)
(3, 'Prof. Hemant B. Vasaikar', 'hbv@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(4, 'Prof. D.M. Patil', 'dmp@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(5, 'Prof. Kaisar Katchi', 'kk@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(6, 'Prof. Asma Tambe', 'at@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),

-- Student 7 (Default test student in FE-A1)
(7, 'Aarav Sharma', 'aarav.sharma@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),

-- Remaining Faculty Members
(8, 'Prof. Divyesh J. Patel', 'djp@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(9, 'Prof. Gaurav P. Sawant', 'gps@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(10, 'Prof. Sushma Pandey', 'sp.ec@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(11, 'Prof. Chandrashekhar Gajbhiye', 'crg@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(12, 'Prof. Meghana Naik', 'mn@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(13, 'Prof. Radha Sonavdekar', 'rrs@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(14, 'Prof. Govind Gaundalkar', 'gg@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(15, 'Prof. Prathmesh Gunjgur', 'pg@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(16, 'Prof. Isha Sawalkar', 'is@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(17, 'Prof. Azman Qureshi', 'aq@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(18, 'Prof. Nikhil Handa', 'nh@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(19, 'Prof. Ranjana Shukla', 'rs@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(20, 'Prof. Saksham Kataria', 'sk@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(21, 'Prof. Karuna Shinde', 'ks@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(22, 'Prof. Amey Morye', 'am@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(23, 'Prof. Sohel Pathan', 'sp.ipl@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(24, 'Dr. B.N. Chaudhari', 'bnc@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(25, 'Prof. Milind Paraye', 'mp@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(26, 'Prof. Sneha Weakey', 'sw@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(27, 'Prof. Ram Kumar', 'rk@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(28, 'Prof. Ashwini Kumar', 'ak@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(29, 'Prof. Shubhangi Verulkar', 'sv.dsm@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(30, 'Prof. Rajendra Sutar', 'rgs@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(31, 'Prof. Suraj Vishwakarma', 'sbv@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(32, 'Dr. Ananthalakshmi V.', 'av@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(33, 'Prof. Deepak Nair', 'dn@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(34, 'Prof. Sonali Dudhhali', 'sd@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(35, 'Prof. Sparsh Vyas', 'sv.pc@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(36, 'Prof. Aman Yadav', 'ay@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(37, 'Prof. A.D.', 'ad@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(38, 'Prof. G.T. Halbe', 'gth@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(39, 'Prof. Ojasvi Pal', 'op@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(40, 'Prof. Rajendra Sawant', 'rrs.bee@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),

-- Student Users (Divisions A, B, C, D)
(41, 'Ananya Deshmukh', 'ananya.deshmukh@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(42, 'Rohan Joshi', 'rohan.joshi@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(43, 'Diya Patel', 'diya.patel@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(44, 'Siddharth Verma', 'siddharth.verma@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(45, 'Tanvi Kulkarni', 'tanvi.kulkarni@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(46, 'Yash Mehta', 'yash.mehta@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(47, 'Rhea Shah', 'rhea.shah@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(48, 'Aditya Nair', 'aditya.nair@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(49, 'Sneha Rane', 'sneha.rane@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(50, 'Varun Gupta', 'varun.gupta@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(51, 'Ishita Roy', 'ishita.roy@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(52, 'Harsh Vardhan', 'harsh.vardhan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(53, 'Pooja Kadam', 'pooja.kadam@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(54, 'Kunal Shinde', 'kunal.shinde@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(55, 'Anika Iyer', 'anika.iyer@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),

-- Div B Students (Batches B1, B2, B3, B4)
(56, 'Kabir Malhotra', 'kabir.malhotra@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(57, 'Meera Pillai', 'meera.pillai@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(58, 'Aryan Bhatt', 'aryan.bhatt@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(59, 'Simran Kaur', 'simran.kaur@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(60, 'Devansh Trivedi', 'devansh.trivedi@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(61, 'Gauri Sawant', 'gauri.sawant@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(62, 'Pranav Patil', 'pranav.patil@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(63, 'Riya Chavan', 'riya.chavan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(64, 'Tejas Jadhav', 'tejas.jadhav@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(65, 'Shreya Prabhu', 'shreya.prabhu@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(66, 'Neil DSouza', 'neil.dsouza@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(67, 'Alisha Khan', 'alisha.khan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(68, 'Parth More', 'parth.more@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(69, 'Sanjana Bhat', 'sanjana.bhat@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(70, 'Vedant Salunkhe', 'vedant.salunkhe@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(71, 'Tanisha Sen', 'tanisha.sen@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),

-- Div C Students (Batches C1, C2, C3, C4)
(72, 'Samar Chauhan', 'samar.chauhan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(73, 'Kriti Saxena', 'kriti.saxena@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(74, 'Manav Naik', 'manav.naik@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(75, 'Natasha Das', 'natasha.das@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(76, 'Dhruv Soni', 'dhruv.soni@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(77, 'Avani Mane', 'avani.mane@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(78, 'Omkar Gokhale', 'omkar.gokhale@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(79, 'Sara Fernandes', 'sara.fernandes@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(80, 'Ayush Kamat', 'ayush.kamat@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(81, 'Jhanvi Thakur', 'jhanvi.thakur@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(82, 'Sahil Pawar', 'sahil.pawar@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(83, 'Mahi Chopra', 'mahi.chopra@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(84, 'Rishabh Jain', 'rishabh.jain@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(85, 'Disha Mahajan', 'disha.mahajan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(86, 'Armaan Shaikh', 'armaan.shaikh@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(87, 'Shruti Bhosle', 'shruti.bhosle@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),

-- Div D Students (Batches D1, D2, D3, D4)
(88, 'Vivaan Rao', 'vivaan.rao@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(89, 'Nidhi Shenoy', 'nidhi.shenoy@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(90, 'Arnav Date', 'arnav.date@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(91, 'Siya Agarwal', 'siya.agarwal@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(92, 'Chirag Mhatre', 'chirag.mhatre@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(93, 'Payal Ghag', 'payal.ghag@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(94, 'Rohit Wagh', 'rohit.wagh@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(95, 'Tanay Bapat', 'tanay.bapat@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(96, 'Nishant Parab', 'nishant.parab@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(97, 'Urvi Kale', 'urvi.kale@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(98, 'Darsh Jagtap', 'darsh.jagtap@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(99, 'Vidhi Solanki', 'vidhi.solanki@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(100, 'Kshitij Gaikwad', 'kshitij.gaikwad@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(101, 'Ira Kothari', 'ira.kothari@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(102, 'Gaurang Tawde', 'gaurang.tawde@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(103, 'Bhavika Chheda', 'bhavika.chheda@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),

-- Division E Faculty
(104, 'Prof. Shailaja Kurode', 'srk@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(105, 'Prof. Suman Majee', 'sm@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),

-- Division E Students (Batches E1, E2, E3, E4)
(106, 'Arya Kashyap', 'arya.kashyap@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(107, 'Bhumika Sharma', 'bhumika.sharma@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(108, 'Chetan Mistry', 'chetan.mistry@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(109, 'Deepika Rathi', 'deepika.rathi@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(110, 'Ekansh Singhania', 'ekansh.singhania@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(111, 'Falguni Vora', 'falguni.vora@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(112, 'Girish Somani', 'girish.somani@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(113, 'Himani Bajaj', 'himani.bajaj@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(114, 'Ishaan Khattar', 'ishaan.khattar@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(115, 'Juhi Chawla', 'juhi.chawla@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(116, 'Kartik Aaryan', 'kartik.aaryan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(117, 'Lavanya Iyer', 'lavanya.iyer@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(118, 'Madhav Anand', 'madhav.anand@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(119, 'Nandini Sen', 'nandini.sen@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(120, 'Om Pathak', 'om.pathak@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(121, 'Pari Mittal', 'pari.mittal@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),

-- Division F Faculty
(122, 'Prof. Aishwarya Nalawade', 'an@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),

-- Division F Students (Batches F1, F2, F3, F4)
(123, 'Qasim Ansari', 'qasim.ansari@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(124, 'Riddhi Shah', 'riddhi.shah@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(125, 'Soham Kadam', 'soham.kadam@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(126, 'Tara Subramanian', 'tara.subramanian@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(127, 'Utkarsh Saxena', 'utkarsh.saxena@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(128, 'Vaishnavi Pillai', 'vaishnavi.pillai@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(129, 'Wahid Sheikh', 'wahid.sheikh@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(130, 'Xena DSilva', 'xena.dsilva@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(131, 'Yuvraj Sisodia', 'yuvraj.sisodia@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(132, 'Zoya Farooqui', 'zoya.farooqui@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(133, 'Abhay Deol', 'abhay.deol@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(134, 'Barkha Singh', 'barkha.singh@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(135, 'Chetna Rao', 'chetna.rao@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(136, 'Devraj Chauhan', 'devraj.chauhan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(137, 'Esha Gupta', 'esha.gupta@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(138, 'Farhan Akhtar', 'farhan.akhtar@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),

-- Division G Faculty
(139, 'Prof. Narendra Bhagat', 'nab@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(140, 'Prof. Mohini Khadilkar', 'mk@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),
(141, 'Prof. Anshuman Kalbhore', 'ak.ipl@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),

-- Division G Students (Batches G1, G2, G3, G4)
(142, 'Girish Agarwal', 'girish.agarwal@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(143, 'Hiral Bhatt', 'hiral.bhatt@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(144, 'Inderjit Singh', 'inderjit.singh@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(145, 'Jaya Bharadwaj', 'jaya.bharadwaj@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(146, 'Kunal Kapoor', 'kunal.kapoor@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(147, 'Leena Nair', 'leena.nair@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(148, 'Manish Paul', 'manish.paul@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(149, 'Nupur Sanon', 'nupur.sanon@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(150, 'Omkar Das', 'omkar.das@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(151, 'Pallavi Sharda', 'pallavi.sharda@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(152, 'Raghav Juyal', 'raghav.juyal@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(153, 'Sakshi Malik', 'sakshi.malik@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(154, 'Tushar Pandey', 'tushar.pandey@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(155, 'Urvashi Rautela', 'urvashi.rautela@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(156, 'Varun Sharma', 'varun.sharma@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(157, 'Yami Gautam', 'yami.gautam@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),

-- Division H Faculty
(158, 'Prof. Taufiq Shaikh', 'ts@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 1),

-- Division H Students (Batches H1, H2, H3, H4)
(159, 'Zack Snyder', 'zack.snyder@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(160, 'Aalia Furniturewala', 'aalia.furniturewala@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(161, 'Bobby Deol', 'bobby.deol@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(162, 'Chitrangada Singh', 'chitrangada.singh@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(163, 'Dhanush Raja', 'dhanush.raja@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(164, 'Elli AvrRam', 'elli.avrram@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(165, 'Fardeen Khan', 'fardeen.khan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(166, 'Genelia DSouza', 'genelia.dsouza@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(167, 'Himesh Reshammiya', 'himesh.reshammiya@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(168, 'Ileana DCruz', 'ileana.dcruz@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(169, 'Jaideep Ahlawat', 'jaideep.ahlawat@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(170, 'Kalki Koechlin', 'kalki.koechlin@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(171, 'Lucky Ali', 'lucky.ali@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(172, 'Mallika Sherawat', 'mallika.sherawat@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(173, 'Naseeruddin Shah', 'naseeruddin.shah@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),
(174, 'Om Puri', 'om.puri@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 1),

-- Second Year Computer Engineering Faculty
(175, 'Dr. Sudhir Dhage', 'snd@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(176, 'Dr. Kailas Devadkar', 'kkd@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(177, 'Dr. Anant Nimkar', 'avn@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(178, 'Prof. Anand A. Godbole', 'aag@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(179, 'Dr. Jignesh Sisodia', 'js@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(180, 'Dr. Nataasha Raul', 'nr@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(181, 'Dr. Aarti Tewari', 'aarti.tewari@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(182, 'Dr. P. B. Bhavathankar', 'pbb@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(183, 'Prof. Kiran Bhabar', 'kb@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(184, 'Prof. Chinmay Vanjare', 'cv@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(185, 'Prof. Jyoti Ramteke', 'jr@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(186, 'Prof. Prathamesh Lokhande', 'pl@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(187, 'Prof. Falak Malik', 'fm@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(188, 'Dr. Rupali Sawant', 'rhs@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(189, 'Dr. Y. S. Rao', 'ysr@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),
(190, 'Prof. A.V. Sawant', 'avs@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'FACULTY', 2),

-- SE Computer Engineering Division A Students (Batches SE-CE-A1 to A4)
(191, 'Aaradhya Joshi', 'aaradhya.joshi@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(192, 'Bhavin Kothari', 'bhavin.kothari@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(193, 'Charvi Shah', 'charvi.shah@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(194, 'Deven Parekh', 'deven.parekh@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(195, 'Eesha Dalal', 'eesha.dalal@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(196, 'Farhan Merchant', 'farhan.merchant@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(197, 'Garima Tiwari', 'garima.tiwari@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(198, 'Harshit Verma', 'harshit.verma@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(199, 'Ishani Deshpande', 'ishani.deshpande@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(200, 'Jayesh Solanki', 'jayesh.solanki@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(201, 'Kavya Ranganathan', 'kavya.ranganathan@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(202, 'Lakshya Sen', 'lakshya.sen@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(203, 'Meera Nambiar', 'meera.nambiar@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(204, 'Nikhil Kulkarni', 'nikhil.kulkarni@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(205, 'Ojasvi Shinde', 'ojasvi.shinde@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2),
(206, 'Pranav Hegde', 'pranav.hegde@spit.ac.in', '$2b$10$K7Xk9d8a3Lq0mE3d0fR0YeQfP8Z3L3v9aB3n9bC8v7x6z5y4w3u2', 'STUDENT', 2);

-- ---------------------------------------------------------------------
-- 3. BATCHES (Divisions A, B, C, D - 4 sub-batches each)
-- ---------------------------------------------------------------------
INSERT INTO batch (batch_id, batch_name, dept_id) VALUES
(1, 'FE-A1', 1),
(2, 'FE-A2', 1),
(3, 'FE-A3', 1),
(4, 'FE-A4', 1),
(5, 'FE-B1', 1),
(6, 'FE-B2', 1),
(7, 'FE-B3', 1),
(8, 'FE-B4', 1),
(9, 'FE-C1', 1),
(10, 'FE-C2', 1),
(11, 'FE-C3', 1),
(12, 'FE-C4', 1),
(13, 'FE-D1', 1),
(14, 'FE-D2', 1),
(15, 'FE-D3', 1),
(16, 'FE-D4', 1),
(17, 'FE-E1', 1),
(18, 'FE-E2', 1),
(19, 'FE-E3', 1),
(20, 'FE-E4', 1),
(21, 'FE-F1', 1),
(22, 'FE-F2', 1),
(23, 'FE-F3', 1),
(24, 'FE-F4', 1),
(25, 'FE-G1', 1),
(26, 'FE-G2', 1),
(27, 'FE-G3', 1),
(28, 'FE-G4', 1),
(29, 'FE-H1', 1),
(30, 'FE-H2', 1),
(31, 'FE-H3', 1),
(32, 'FE-H4', 1),
-- Second Year Computer Engineering Division A Batches
(33, 'SE-CE-A1', 2),
(34, 'SE-CE-A2', 2),
(35, 'SE-CE-A3', 2),
(36, 'SE-CE-A4', 2);

-- ---------------------------------------------------------------------
-- 4. STUDENT_BATCH
-- ---------------------------------------------------------------------
INSERT INTO student_batch (student_id, batch_id) VALUES
-- Batch FE-A1 (including test student 7)
(7, 1), (41, 1), (42, 1), (43, 1),
-- Batch FE-A2
(44, 2), (45, 2), (46, 2), (47, 2),
-- Batch FE-A3
(48, 3), (49, 3), (50, 3), (51, 3),
-- Batch FE-A4
(52, 4), (53, 4), (54, 4), (55, 4),

-- Batch FE-B1
(56, 5), (57, 5), (58, 5), (59, 5),
-- Batch FE-B2
(60, 6), (61, 6), (62, 6), (63, 6),
-- Batch FE-B3
(64, 7), (65, 7), (66, 7), (67, 7),
-- Batch FE-B4
(68, 8), (69, 8), (70, 8), (71, 8),

-- Batch FE-C1
(72, 9), (73, 9), (74, 9), (75, 9),
-- Batch FE-C2
(76, 10), (77, 10), (78, 10), (79, 10),
-- Batch FE-C3
(80, 11), (81, 11), (82, 11), (83, 11),
-- Batch FE-C4
(84, 12), (85, 12), (86, 12), (87, 12),

-- Batch FE-D1
(88, 13), (89, 13), (90, 13), (91, 13),
-- Batch FE-D2
(92, 14), (93, 14), (94, 14), (95, 14),
-- Batch FE-D3
(96, 15), (97, 15), (98, 15), (99, 15),
-- Batch FE-D4
(100, 16), (101, 16), (102, 16), (103, 16),

-- Batch FE-E1
(106, 17), (107, 17), (108, 17), (109, 17),
-- Batch FE-E2
(110, 18), (111, 18), (112, 18), (113, 18),
-- Batch FE-E3
(114, 19), (115, 19), (116, 19), (117, 19),
-- Batch FE-E4
(118, 20), (119, 20), (120, 20), (121, 20),

-- Batch FE-F1
(123, 21), (124, 21), (125, 21), (126, 21),
-- Batch FE-F2
(127, 22), (128, 22), (129, 22), (130, 22),
-- Batch FE-F3
(131, 23), (132, 23), (133, 23), (134, 23),
-- Batch FE-F4
(135, 24), (136, 24), (137, 24), (138, 24),

-- Batch FE-G1
(142, 25), (143, 25), (144, 25), (145, 25),
-- Batch FE-G2
(146, 26), (147, 26), (148, 26), (149, 26),
-- Batch FE-G3
(150, 27), (151, 27), (152, 27), (153, 27),
-- Batch FE-G4
(154, 28), (155, 28), (156, 28), (157, 28),

-- Batch FE-H1
(159, 29), (160, 29), (161, 29), (162, 29),
-- Batch FE-H2
(163, 30), (164, 30), (165, 30), (166, 30),
-- Batch FE-H3
(167, 31), (168, 31), (169, 31), (170, 31),
-- Batch FE-H4
(171, 32), (172, 32), (173, 32), (174, 32),

-- Batch SE-CE-A1
(191, 33), (192, 33), (193, 33), (194, 33),
-- Batch SE-CE-A2
(195, 34), (196, 34), (197, 34), (198, 34),
-- Batch SE-CE-A3
(199, 35), (200, 35), (201, 35), (202, 35),
-- Batch SE-CE-A4
(203, 36), (204, 36), (205, 36), (206, 36);

-- ---------------------------------------------------------------------
-- 5. COURSES
-- ---------------------------------------------------------------------
INSERT INTO course (course_id, course_code, course_name, dept_id) VALUES
(1, 'CS101', 'Imperative Programming Language (IPL)', 1),
(2, 'ME102', 'Computer Aided Engineering Drawing (CAED)', 1),
(3, 'EX103', 'Digital Systems and Microprocessors (DSM)', 1),
(4, 'CH104', 'Industrial Chemistry (IC)', 1),
(5, 'EE105', 'Engineering Exploration (EE)', 1),
(6, 'MA106', 'Engineering Calculus (EC)', 1),
(7, 'HM107', 'Professional Communication (PC)', 1),
(8, 'PH108', 'Engineering Physics (EP)', 1),
(9, 'EE109', 'Basic Electrical Engineering (BEE)', 1),
(10, 'EE110', 'Materials for EEE (MEEE)', 1),
(11, 'DT111', 'Design Thinking (DT)', 1),
(12, 'BS112', 'Biology for Engineers (BFE)', 1),
-- Second Year Computer Engineering Courses
(13, 'CE201', 'Data Structures (DS)', 2),
(14, 'CE202', 'Database Management Systems (DBMS)', 2),
(15, 'CE203', 'Computer Organization and Architecture (COA)', 2),
(16, 'CE204', 'Data Science (Data Sci)', 2),
(17, 'CE205', 'Discrete Structures & Graph Theory (DSGT)', 2),
(18, 'BS206', 'Fundamentals of Mathematics (FOM)', 2),
(19, 'OE207', 'Fundamentals of System Engineering (FOSE)', 2),
(20, 'OE208', 'Fundamentals of Internet of Things (F-IoT)', 2);

-- ---------------------------------------------------------------------
-- 6. LABS & ROOMS
-- ---------------------------------------------------------------------
INSERT INTO lab (lab_id, lab_name, capacity, gpu_capacity) VALUES
-- Computing Labs: IPL-003 partitioned into bays
(1, 'IPL-003 (Bay 1)', 25, 0),
(2, 'IPL-003 (Bay 2)', 25, 0),
(3, 'IPL-003 (Bay 3)', 25, 0),
(4, 'IPL-003 (Bay 4)', 25, 0),
-- Drawing / CAD Labs: CAED-001
(5, 'CAED-001 (Bay 1)', 30, 16),
(6, 'CAED-001 (Bay 2)', 30, 16),
-- Electronics / Microprocessor Labs: DSM-502
(7, 'DSM-502 (Bay 1)', 25, 0),
(8, 'DSM-502 (Bay 2)', 25, 0),
-- Engineering Exploration: IDEA / PRAYS Labs
(9, 'IDEA/PRAYS (Bay 1)', 25, 0),
(10, 'IDEA/PRAYS (Bay 2)', 25, 0),
-- Chemistry Lab: IC-106
(11, 'IC-106 (Chemistry Lab)', 30, 0),
-- Tutorial & Communication Rooms
(12, 'Room-101 (Tutorial Room)', 35, 0),
(13, 'Room-108 (Tutorial Room)', 35, 0),
(14, 'Room-203 (Tutorial Room)', 35, 0),
(15, 'Room-307 (Tutorial Room)', 35, 0),
(16, 'Room-409 (Tutorial Room)', 35, 0),
(17, 'Room-508 (Tutorial Room)', 35, 0),
(18, 'Room-601 (Tutorial Room)', 35, 0),
(19, 'Room-605 (Tutorial Room)', 35, 0),
(20, 'Room-701 (Tutorial Room)', 35, 0),
(21, 'Room-002 (Tutorial Room)', 35, 0),
(22, 'Room-207 (Tutorial Room)', 35, 0),
(23, 'Room-103 (Tutorial Room)', 35, 0),
(24, 'BEE-206 (Electrical Lab)', 30, 0),
(25, 'PHY-Lab (Physics Lab)', 30, 0),
(26, 'Room-407 (Tutorial Room)', 35, 0),
(27, 'Room-305 (Tutorial Room)', 35, 0),
(28, 'Room-405 (Tutorial Room)', 35, 0),
-- Second Year Computer Engineering Labs & Rooms
(29, 'Lab-606 (Bay 4)', 25, 0),
(30, 'Lab-606 (Bay 5)', 25, 0),
(31, 'Lab-607 (Bay B)', 25, 0),
(32, 'Lab-608', 30, 0),
(33, 'Lab-702 (Bay C)', 25, 0),
(34, 'Lab-603 (Bay 3)', 25, 0),
(35, 'Lab-604', 30, 0),
(36, 'Lab-603 (Bay 7)', 25, 0),
(37, 'Lab-509 (Old Lab)', 25, 0),
(38, 'Lab-603 (Bay 2)', 25, 0),
(39, 'Lab-702 (Bay B)', 25, 0),
(40, 'Lab-703 (Bay B)', 25, 0),
(41, 'Lab-702 (Bay A)', 25, 0),
(42, 'Room-609 (Classroom)', 40, 0),
(43, 'Room-309 (Classroom)', 40, 0);

-- ---------------------------------------------------------------------
-- 7. OPERATING SYSTEMS
-- ---------------------------------------------------------------------
INSERT INTO operating_system (os_id, os_name) VALUES
(1, 'Ubuntu 22.04 LTS'),
(2, 'Windows 11 Education'),
(3, 'Debian GNU/Linux 12');

-- ---------------------------------------------------------------------
-- 8. LAB_OS
-- ---------------------------------------------------------------------
INSERT INTO lab_os (lab_id, os_id) VALUES
(1, 1), (1, 2),
(2, 1), (2, 2),
(3, 1), (3, 2),
(4, 1), (4, 2),
(5, 2),
(6, 2),
(7, 1), (7, 2),
(8, 1), (8, 2),
(9, 1), (9, 2),
(10, 1), (10, 2),
(11, 2),
(24, 2),
(25, 2),
-- SE Computing Labs
(29, 1), (29, 2),
(30, 1), (30, 2),
(31, 1), (31, 2),
(32, 1), (32, 2),
(33, 1), (33, 2),
(34, 1), (34, 2),
(35, 1), (35, 2),
(36, 1), (36, 2),
(37, 1), (37, 2),
(38, 1), (38, 2),
(39, 1), (39, 2),
(40, 1), (40, 2),
(41, 1), (41, 2);

-- ---------------------------------------------------------------------
-- 9. SOFTWARE CATALOG
-- ---------------------------------------------------------------------
INSERT INTO software (software_id, software_name) VALUES
(1, 'GCC / Clang Compiler'),
(2, 'VS Code Studio'),
(3, 'AutoCAD 2024'),
(4, 'SolidWorks 3D CAD'),
(5, 'Logisim-Evolution'),
(6, 'Keil uVision 5 IDE'),
(7, 'Python 3.12'),
(8, 'ChemDraw / LabQuest 3'),
(9, 'MySQL 8.0 Server'),
(10, 'MySQL Workbench 8.0'),
(11, 'Jupyter Notebook & Pandas');

-- ---------------------------------------------------------------------
-- 10. LAB_SOFTWARE
-- ---------------------------------------------------------------------
INSERT INTO lab_software (lab_id, software_id) VALUES
-- IPL-003 Bays (GCC, VS Code, Python)
(1, 1), (1, 2), (1, 7),
(2, 1), (2, 2), (2, 7),
(3, 1), (3, 2), (3, 7),
(4, 1), (4, 2), (4, 7),
-- CAED-001 Bays (AutoCAD, SolidWorks)
(5, 3), (5, 4),
(6, 3), (6, 4),
-- DSM-502 Bays (Logisim, Keil uVision)
(7, 5), (7, 6),
(8, 5), (8, 6),
-- IC-106 (ChemDraw)
(11, 8),
-- SE Computing Labs (606, 607, 608, 603, 604, 702, 703, 509)
(29, 1), (29, 2), (29, 5), (29, 9), (29, 10),
(30, 1), (30, 2), (30, 9), (30, 10),
(31, 1), (31, 2), (31, 7), (31, 9), (31, 10), (31, 11),
(32, 1), (32, 2), (32, 5), (32, 7), (32, 11),
(33, 1), (33, 2), (33, 5),
(34, 1), (34, 2),
(35, 1), (35, 2),
(36, 9), (36, 10),
(37, 1), (37, 2),
(38, 1), (38, 2),
(39, 1), (39, 2),
(40, 7), (40, 11),
(41, 7), (41, 11);

-- ---------------------------------------------------------------------
-- 11. COURSE_SOFTWARE
-- ---------------------------------------------------------------------
INSERT INTO course_software (course_id, software_id) VALUES
(1, 1), (1, 2),         -- IPL needs GCC, VS Code
(2, 3), (2, 4),         -- CAED needs AutoCAD, SolidWorks (Used for Relational Division Q4)
(3, 5), (3, 6),         -- DSM needs Logisim, Keil
(4, 8),                 -- IC needs ChemDraw
(13, 1), (13, 2),       -- DS needs GCC, VS Code
(14, 9), (14, 10),      -- DBMS needs MySQL Server, MySQL Workbench
(15, 5),                -- COA needs Logisim Evolution
(16, 7), (16, 11);      -- Data Sci needs Python, Jupyter Notebook                 -- IC needs ChemDraw

-- ---------------------------------------------------------------------
-- 12. WORKSTATIONS (Physical hardware terminals)
-- ---------------------------------------------------------------------
INSERT INTO workstation (workstation_id, lab_id, station_number, status) VALUES
-- IPL-003 Bay 1 (Workstations 1-6)
(1, 1, 1, 'ACTIVE'),
(2, 1, 2, 'ACTIVE'),
(3, 1, 3, 'ACTIVE'),
(4, 1, 4, 'ACTIVE'),
(5, 1, 5, 'FAULTY'),
(6, 1, 6, 'ACTIVE'),
-- IPL-003 Bay 2 (Workstations 7-12)
(7, 2, 1, 'ACTIVE'),
(8, 2, 2, 'ACTIVE'),
(9, 2, 3, 'ACTIVE'),
(10, 2, 4, 'ACTIVE'),
(11, 2, 5, 'ACTIVE'),
(12, 2, 6, 'ACTIVE'),
-- IPL-003 Bay 3 (Workstations 13-18)
(13, 3, 1, 'ACTIVE'),
(14, 3, 2, 'ACTIVE'),
(15, 3, 3, 'ACTIVE'),
(16, 3, 4, 'ACTIVE'),
(17, 3, 5, 'MAINTENANCE'),
(18, 3, 6, 'ACTIVE'),
-- IPL-003 Bay 4 (Workstations 19-24)
(19, 4, 1, 'ACTIVE'),
(20, 4, 2, 'ACTIVE'),
(21, 4, 3, 'ACTIVE'),
(22, 4, 4, 'ACTIVE'),
(23, 4, 5, 'ACTIVE'),
(24, 4, 6, 'ACTIVE'),
-- CAED-001 Bay 1 (Workstations 25-30)
(25, 5, 1, 'ACTIVE'),
(26, 5, 2, 'ACTIVE'),
(27, 5, 3, 'ACTIVE'),
(28, 5, 4, 'ACTIVE'),
(29, 5, 5, 'ACTIVE'),
(30, 5, 6, 'ACTIVE'),
-- CAED-001 Bay 2 (Workstations 31-36)
(31, 6, 1, 'ACTIVE'),
(32, 6, 2, 'ACTIVE'),
(33, 6, 3, 'ACTIVE'),
(34, 6, 4, 'ACTIVE'),
(35, 6, 5, 'ACTIVE'),
(36, 6, 6, 'ACTIVE'),
-- DSM-502 Bay 1 (Workstations 37-42)
(37, 7, 1, 'ACTIVE'),
(38, 7, 2, 'ACTIVE'),
(39, 7, 3, 'ACTIVE'),
(40, 7, 4, 'ACTIVE'),
(41, 7, 5, 'ACTIVE'),
(42, 7, 6, 'ACTIVE'),
-- DSM-502 Bay 2 (Workstations 43-48)
(43, 8, 1, 'ACTIVE'),
(44, 8, 2, 'ACTIVE'),
(45, 8, 3, 'ACTIVE'),
(46, 8, 4, 'ACTIVE'),
(47, 8, 5, 'ACTIVE'),
(48, 8, 6, 'ACTIVE'),
-- IDEA/PRAYS Bay 1 (Workstations 49-54)
(49, 9, 1, 'ACTIVE'),
(50, 9, 2, 'ACTIVE'),
(51, 9, 3, 'ACTIVE'),
(52, 9, 4, 'ACTIVE'),
(53, 9, 5, 'ACTIVE'),
(54, 9, 6, 'ACTIVE'),
-- IDEA/PRAYS Bay 2 (Workstations 55-60)
(55, 10, 1, 'ACTIVE'),
(56, 10, 2, 'ACTIVE'),
(57, 10, 3, 'ACTIVE'),
(58, 10, 4, 'ACTIVE'),
(59, 10, 5, 'ACTIVE'),
(60, 10, 6, 'ACTIVE'),
-- IC-106 Chemistry Lab (Workstations 61-66)
(61, 11, 1, 'ACTIVE'),
(62, 11, 2, 'ACTIVE'),
(63, 11, 3, 'ACTIVE'),
(64, 11, 4, 'ACTIVE'),
(65, 11, 5, 'ACTIVE'),
(66, 11, 6, 'ACTIVE'),
-- Tutorial Room Workstations / Desks (67-80)
(67, 12, 1, 'ACTIVE'), (68, 12, 2, 'ACTIVE'),
(69, 13, 1, 'ACTIVE'), (70, 13, 2, 'ACTIVE'),
(71, 14, 1, 'ACTIVE'), (72, 14, 2, 'ACTIVE'),
(73, 15, 1, 'ACTIVE'), (74, 15, 2, 'ACTIVE'),
(75, 20, 1, 'ACTIVE'), (76, 21, 1, 'ACTIVE'),
(77, 22, 1, 'ACTIVE'), (78, 22, 2, 'ACTIVE'),
(79, 23, 1, 'ACTIVE'), (80, 23, 2, 'ACTIVE'),
-- BEE-206 Electrical Lab (Workstations 81-86)
(81, 24, 1, 'ACTIVE'), (82, 24, 2, 'ACTIVE'), (83, 24, 3, 'ACTIVE'),
(84, 24, 4, 'ACTIVE'), (85, 24, 5, 'ACTIVE'), (86, 24, 6, 'ACTIVE'),
-- PHY-Lab Physics Lab (Workstations 87-92)
(87, 25, 1, 'ACTIVE'), (88, 25, 2, 'ACTIVE'), (89, 25, 3, 'ACTIVE'),
(90, 25, 4, 'ACTIVE'), (91, 25, 5, 'ACTIVE'), (92, 25, 6, 'ACTIVE'),
-- Room-407 Desks (93-94)
(93, 26, 1, 'ACTIVE'), (94, 26, 2, 'ACTIVE'),
-- Room-305 Desks (95-96)
(95, 27, 1, 'ACTIVE'), (96, 27, 2, 'ACTIVE'),
-- Room-405 Desks (97-98)
(97, 28, 1, 'ACTIVE'), (98, 28, 2, 'ACTIVE'),
-- SE Computing Labs Terminals
-- Lab-606 Bay 4 (99-104)
(99, 29, 1, 'ACTIVE'), (100, 29, 2, 'ACTIVE'), (101, 29, 3, 'ACTIVE'), (102, 29, 4, 'ACTIVE'), (103, 29, 5, 'ACTIVE'), (104, 29, 6, 'ACTIVE'),
-- Lab-606 Bay 5 (105-110)
(105, 30, 1, 'ACTIVE'), (106, 30, 2, 'ACTIVE'), (107, 30, 3, 'ACTIVE'), (108, 30, 4, 'ACTIVE'), (109, 30, 5, 'ACTIVE'), (110, 30, 6, 'ACTIVE'),
-- Lab-607 Bay B (111-116)
(111, 31, 1, 'ACTIVE'), (112, 31, 2, 'ACTIVE'), (113, 31, 3, 'ACTIVE'), (114, 31, 4, 'ACTIVE'), (115, 31, 5, 'ACTIVE'), (116, 31, 6, 'ACTIVE'),
-- Lab-608 (117-122)
(117, 32, 1, 'ACTIVE'), (118, 32, 2, 'ACTIVE'), (119, 32, 3, 'ACTIVE'), (120, 32, 4, 'ACTIVE'), (121, 32, 5, 'ACTIVE'), (122, 32, 6, 'ACTIVE'),
-- Lab-702 Bay C (123-128)
(123, 33, 1, 'ACTIVE'), (124, 33, 2, 'ACTIVE'), (125, 33, 3, 'ACTIVE'), (126, 33, 4, 'ACTIVE'), (127, 33, 5, 'ACTIVE'), (128, 33, 6, 'ACTIVE'),
-- Lab-603 Bay 3 (129-134)
(129, 34, 1, 'ACTIVE'), (130, 34, 2, 'ACTIVE'), (131, 34, 3, 'ACTIVE'), (132, 34, 4, 'ACTIVE'), (133, 34, 5, 'ACTIVE'), (134, 34, 6, 'ACTIVE'),
-- Lab-604 (135-140)
(135, 35, 1, 'ACTIVE'), (136, 35, 2, 'ACTIVE'), (137, 35, 3, 'ACTIVE'), (138, 35, 4, 'ACTIVE'), (139, 35, 5, 'ACTIVE'), (140, 35, 6, 'ACTIVE'),
-- Lab-603 Bay 7 (141-146)
(141, 36, 1, 'ACTIVE'), (142, 36, 2, 'ACTIVE'), (143, 36, 3, 'ACTIVE'), (144, 36, 4, 'ACTIVE'), (145, 36, 5, 'ACTIVE'), (146, 36, 6, 'ACTIVE'),
-- Lab-509 Old Lab (147-152)
(147, 37, 1, 'ACTIVE'), (148, 37, 2, 'ACTIVE'), (149, 37, 3, 'ACTIVE'), (150, 37, 4, 'ACTIVE'), (151, 37, 5, 'ACTIVE'), (152, 37, 6, 'ACTIVE'),
-- Lab-603 Bay 2 (153-158)
(153, 38, 1, 'ACTIVE'), (154, 38, 2, 'ACTIVE'), (155, 38, 3, 'ACTIVE'), (156, 38, 4, 'ACTIVE'), (157, 38, 5, 'ACTIVE'), (158, 38, 6, 'ACTIVE'),
-- Lab-702 Bay B (159-164)
(159, 39, 1, 'ACTIVE'), (160, 39, 2, 'ACTIVE'), (161, 39, 3, 'ACTIVE'), (162, 39, 4, 'ACTIVE'), (163, 39, 5, 'ACTIVE'), (164, 39, 6, 'ACTIVE'),
-- Lab-703 Bay B (165-170)
(165, 40, 1, 'ACTIVE'), (166, 40, 2, 'ACTIVE'), (167, 40, 3, 'ACTIVE'), (168, 40, 4, 'ACTIVE'), (169, 40, 5, 'ACTIVE'), (170, 40, 6, 'ACTIVE'),
-- Lab-702 Bay A (171-176)
(171, 41, 1, 'ACTIVE'), (172, 41, 2, 'ACTIVE'), (173, 41, 3, 'ACTIVE'), (174, 41, 4, 'ACTIVE'), (175, 41, 5, 'ACTIVE'), (176, 41, 6, 'ACTIVE');

-- ---------------------------------------------------------------------
-- 13. TIME SLOTS (1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday)
-- ---------------------------------------------------------------------
INSERT INTO time_slot (slot_id, day_of_week, start_time, end_time) VALUES
-- Monday (Day 1)
(1, 1, '09:00:00', '10:00:00'),
(2, 1, '10:00:00', '11:00:00'),
(3, 1, '09:00:00', '11:00:00'),
(4, 1, '11:15:00', '12:15:00'),
(5, 1, '12:15:00', '13:15:00'),
(6, 1, '11:15:00', '13:15:00'),
(7, 1, '14:15:00', '15:15:00'),
(8, 1, '15:15:00', '16:15:00'),
(9, 1, '14:15:00', '16:15:00'),
(10, 1, '16:15:00', '17:15:00'),

-- Tuesday (Day 2)
(11, 2, '09:00:00', '10:00:00'),
(12, 2, '10:00:00', '11:00:00'),
(13, 2, '09:00:00', '11:00:00'),
(14, 2, '11:15:00', '12:15:00'),
(15, 2, '12:15:00', '13:15:00'),
(16, 2, '11:15:00', '13:15:00'),
(17, 2, '14:15:00', '15:15:00'),
(18, 2, '15:15:00', '16:15:00'),
(19, 2, '14:15:00', '16:15:00'),
(20, 2, '16:15:00', '17:15:00'),

-- Wednesday (Day 3)
(21, 3, '09:00:00', '10:00:00'),
(22, 3, '10:00:00', '11:00:00'),
(23, 3, '09:00:00', '11:00:00'),
(24, 3, '11:15:00', '12:15:00'),
(25, 3, '12:15:00', '13:15:00'),
(26, 3, '11:15:00', '13:15:00'),
(27, 3, '14:15:00', '15:15:00'),
(28, 3, '15:15:00', '16:15:00'),
(29, 3, '14:15:00', '16:15:00'),
(30, 3, '16:15:00', '17:15:00'),

-- Thursday (Day 4)
(31, 4, '09:00:00', '10:00:00'),
(32, 4, '10:00:00', '11:00:00'),
(33, 4, '09:00:00', '11:00:00'),
(34, 4, '11:15:00', '12:15:00'),
(35, 4, '12:15:00', '13:15:00'),
(36, 4, '11:15:00', '13:15:00'),
(37, 4, '14:15:00', '15:15:00'),
(38, 4, '15:15:00', '16:15:00'),
(39, 4, '14:15:00', '16:15:00'),
(40, 4, '16:15:00', '17:15:00'),

-- Friday (Day 5)
(41, 5, '09:00:00', '10:00:00'),
(42, 5, '10:00:00', '11:00:00'),
(43, 5, '09:00:00', '11:00:00'),
(44, 5, '11:15:00', '12:15:00'),
(45, 5, '12:15:00', '13:15:00'),
(46, 5, '11:15:00', '13:15:00'),
(47, 5, '14:15:00', '15:15:00'),
(48, 5, '15:15:00', '16:15:00'),
(49, 5, '14:15:00', '16:15:00'),
(50, 5, '15:15:00', '17:15:00'),
(51, 5, '16:15:00', '17:15:00'),

-- Extended Afternoon / Evening Sessions (16:15-18:15)
(52, 1, '16:15:00', '18:15:00'),
(53, 1, '17:15:00', '18:15:00'),
(54, 2, '16:15:00', '18:15:00'),
(55, 2, '17:15:00', '18:15:00'),
(56, 3, '16:15:00', '18:15:00'),
(57, 3, '17:15:00', '18:15:00'),
(58, 4, '16:15:00', '18:15:00'),
(59, 4, '17:15:00', '18:15:00'),
(60, 5, '16:15:00', '18:15:00'),
(61, 5, '17:15:00', '18:15:00');

-- ---------------------------------------------------------------------
-- 14. MASTER SCHEDULE (Allocated Timetables for Divisions A, B, C, D)
-- ---------------------------------------------------------------------
INSERT INTO schedule (schedule_id, course_id, faculty_id, lab_id, slot_id, batch_id, session_type) VALUES
-- =================== DIVISION A ===================
-- Mon 09:00-10:00: A1 EC-Tu (DJP, Rm 101), A3 EC-Tu (AT, Rm 701)
(1, 6, 8, 12, 1, 1, 'PRACTICAL'),
(2, 6, 6, 20, 1, 3, 'PRACTICAL'),
-- Mon 11:15-13:15: A1 CAED (DMP), A2 CAED (KK), A3 EE (GTH), A4 EE (SBV)
(3, 2, 4, 5, 6, 1, 'PRACTICAL'),
(4, 2, 5, 6, 6, 2, 'PRACTICAL'),
(5, 5, 38, 9, 6, 3, 'PRACTICAL'),
(6, 5, 31, 10, 6, 4, 'PRACTICAL'),
-- Tue 09:00-10:00: A4 EC-Tu (DJP, Rm 108)
(7, 6, 8, 13, 11, 4, 'PRACTICAL'),
-- Tue 11:15-13:15: A1 EE (GTH), A2 EE (KK), A3 CAED (DMP), A4 CAED (HBV)
(8, 5, 38, 9, 16, 1, 'PRACTICAL'),
(9, 5, 5, 10, 16, 2, 'PRACTICAL'),
(10, 2, 4, 5, 16, 3, 'PRACTICAL'),
(11, 2, 3, 6, 16, 4, 'PRACTICAL'),
-- Wed 09:00-11:00: A1 CAED (DMP), A2 CAED (KK), A3 DSM (AK), A4 DSM (SW)
(12, 2, 4, 5, 23, 1, 'PRACTICAL'),
(13, 2, 5, 6, 23, 2, 'PRACTICAL'),
(14, 3, 28, 7, 23, 3, 'PRACTICAL'),
(15, 3, 26, 8, 23, 4, 'PRACTICAL'),
-- Wed 14:15-15:15: A1 PC (DN, Rm 101), A2 EC-Tu (GPS, Rm 307), A4 PC (SD, Rm 701)
(16, 7, 33, 12, 27, 1, 'PRACTICAL'),
(17, 6, 9, 15, 27, 2, 'PRACTICAL'),
(18, 7, 34, 20, 27, 4, 'PRACTICAL'),
-- Thu 09:00-11:00: A1 DSM (RK), A2 DSM (MP), A3 CAED (KK), A4 CAED (HBV)
(19, 3, 27, 7, 33, 1, 'PRACTICAL'),
(20, 3, 25, 8, 33, 2, 'PRACTICAL'),
(21, 2, 5, 5, 33, 3, 'PRACTICAL'),
(22, 2, 3, 6, 33, 4, 'PRACTICAL'),
-- Thu 15:15-16:15: A3 PC (DN, Rm 101)
(23, 7, 33, 12, 38, 3, 'PRACTICAL'),
-- Fri 11:15-13:15: A1 IPL (PG), A2 IPL (IS), A3 IPL (AQ), A4 IPL (NH)
(24, 1, 15, 1, 46, 1, 'PRACTICAL'),
(25, 1, 16, 2, 46, 2, 'PRACTICAL'),
(26, 1, 17, 3, 46, 3, 'PRACTICAL'),
(27, 1, 18, 4, 46, 4, 'PRACTICAL'),
-- Fri 14:15-15:15: A2 PC (DN, Rm 002)
(28, 7, 33, 21, 47, 2, 'PRACTICAL'),

-- =================== DIVISION B ===================
-- Mon 11:15-13:15: B1 IPL (RS), B2 IPL (SK), B3 IPL (KS), B4 IPL (AM)
(29, 1, 19, 1, 6, 5, 'PRACTICAL'),
(30, 1, 20, 2, 6, 6, 'PRACTICAL'),
(31, 1, 21, 3, 6, 7, 'PRACTICAL'),
(32, 1, 22, 4, 6, 8, 'PRACTICAL'),
-- Mon 14:15-16:15: B1 CAED (HBV), B2 CAED (KK), B3 DSM (MP), B4 DSM (RK)
(33, 2, 3, 5, 9, 5, 'PRACTICAL'),
(34, 2, 5, 6, 9, 6, 'PRACTICAL'),
(35, 3, 25, 7, 9, 7, 'PRACTICAL'),
(36, 3, 27, 8, 9, 8, 'PRACTICAL'),
-- Tue 09:00-10:00: B1 PC (DN, Rm 101)
(37, 7, 33, 12, 11, 5, 'PRACTICAL'),
-- Tue 10:00-11:00: B2 EC-Tu (AT, Rm 409)
(38, 6, 6, 16, 12, 6, 'PRACTICAL'),
-- Wed 09:00-10:00: B2 PC (DN, Rm 108)
(39, 7, 33, 13, 21, 6, 'PRACTICAL'),
-- Wed 10:00-11:00: B3 EC-Tu (SP, Rm 605)
(40, 6, 10, 19, 22, 7, 'PRACTICAL'),
-- Wed 14:15-16:15: B1 EE (AD), B2 EE (GTH), B3 CAED (HBV), B4 CAED (KK)
(41, 5, 37, 9, 29, 5, 'PRACTICAL'),
(42, 5, 38, 10, 29, 6, 'PRACTICAL'),
(43, 2, 3, 5, 29, 7, 'PRACTICAL'),
(44, 2, 5, 6, 29, 8, 'PRACTICAL'),
-- Thu 09:00-10:00: B3 PC (DN, Rm 108)
(45, 7, 33, 13, 31, 7, 'PRACTICAL'),
-- Thu 10:00-11:00: B4 EC-Tu (AT, Rm 701)
(46, 6, 6, 20, 32, 8, 'PRACTICAL'),
-- Thu 14:15-16:15: B1 DSM (SV), B2 DSM (MP), B3 CAED (HBV), B4 CAED (DMP)
(47, 3, 29, 7, 39, 5, 'PRACTICAL'),
(48, 3, 25, 8, 39, 6, 'PRACTICAL'),
(49, 2, 3, 5, 39, 7, 'PRACTICAL'),
(50, 2, 4, 6, 39, 8, 'PRACTICAL'),
-- Fri 11:15-13:15: B1 CAED (HBV), B2 CAED (KK), B3 EE (AD), B4 EE (GTH)
(51, 2, 3, 5, 46, 5, 'PRACTICAL'),
(52, 2, 5, 6, 46, 6, 'PRACTICAL'),
(53, 5, 37, 9, 46, 7, 'PRACTICAL'),
(54, 5, 38, 10, 46, 8, 'PRACTICAL'),
-- Fri 14:15-15:15: B1 EC-Tu (AT, Rm 203), B4 PC (SV_PC, Rm 605)
(55, 6, 6, 14, 47, 5, 'PRACTICAL'),
(56, 7, 35, 19, 47, 8, 'PRACTICAL'),

-- =================== DIVISION C ===================
-- Mon 10:00-11:00 & 11:15-12:15: C1 DSM (RK)
(57, 3, 27, 7, 2, 9, 'PRACTICAL'),
(58, 3, 27, 7, 4, 9, 'PRACTICAL'),
-- Mon 14:15-16:15: C1 IPL (PG), C2 IPL (SK), C3 IPL (KS), C4 IPL (IS)
(59, 1, 15, 1, 9, 9, 'PRACTICAL'),
(60, 1, 20, 2, 9, 10, 'PRACTICAL'),
(61, 1, 21, 3, 9, 11, 'PRACTICAL'),
(62, 1, 16, 4, 9, 12, 'PRACTICAL'),
-- Tue 09:00-10:00: C2 PC (AY, Rm 605), C4 IC (AV, IC-106)
(63, 7, 36, 19, 11, 10, 'PRACTICAL'),
(64, 4, 32, 11, 11, 12, 'PRACTICAL'),
-- Wed 10:00-11:00: C1 EC-Tu (MN, Rm 203)
(65, 6, 12, 14, 22, 9, 'PRACTICAL'),
-- Wed 15:15-16:15: C2 DSM (RK, DSM Bay 1), C3 PC (AY, Rm 108)
(66, 3, 27, 7, 28, 10, 'PRACTICAL'),
(67, 7, 36, 13, 28, 11, 'PRACTICAL'),
-- Thu 09:00-10:00: C3 EC-Tu (MN, Rm 103)
(68, 6, 12, 23, 31, 11, 'PRACTICAL'),
-- Thu 14:15-15:15: C3 IC (AV, IC-106), C4 PC (SV_PC, Rm 002)
(69, 4, 32, 11, 37, 11, 'PRACTICAL'),
(70, 7, 35, 21, 37, 12, 'PRACTICAL'),
-- Thu 14:15-16:15: C1 EE (AD), C2 EE (KK)
(71, 5, 37, 9, 39, 9, 'PRACTICAL'),
(72, 5, 5, 10, 39, 10, 'PRACTICAL'),
-- Thu 16:15-17:15: C4 EC-Tu (CRG, Rm 103)
(73, 6, 11, 23, 40, 12, 'PRACTICAL'),
-- Fri 09:00-10:00: C1 PC (AY, Rm 508)
(74, 7, 36, 17, 41, 9, 'PRACTICAL'),
-- Fri 09:00-11:00: C2 IC (AV, IC-106), C3 DSM (SV, DSM Bay 1), C4 DSM (MP, DSM Bay 2)
(75, 4, 32, 11, 43, 10, 'PRACTICAL'),
(76, 3, 29, 7, 43, 11, 'PRACTICAL'),
(77, 3, 25, 8, 43, 12, 'PRACTICAL'),
-- Fri 14:15-15:15: C1 IC (AV, IC-106), C2 EC-Tu (MN, Rm 108)
(78, 4, 32, 11, 47, 9, 'PRACTICAL'),
(79, 6, 12, 13, 47, 10, 'PRACTICAL'),
-- Fri 15:15-17:15: C3 EE (AD), C4 EE (GTH)
(80, 5, 37, 9, 50, 11, 'PRACTICAL'),
(81, 5, 38, 10, 50, 12, 'PRACTICAL'),

-- =================== DIVISION D ===================
-- Mon 09:00-10:00: D1 PC (AY, Rm 108)
(82, 7, 36, 13, 1, 13, 'PRACTICAL'),
-- Mon 09:00-11:00: D2 IC (AV, IC-106)
(83, 4, 32, 11, 3, 14, 'PRACTICAL'),
-- Tue 09:00-11:00: D3 DSM (AK, DSM Bay 1), D4 DSM (SW, DSM Bay 2)
(84, 3, 28, 7, 13, 15, 'PRACTICAL'),
(85, 3, 26, 8, 13, 16, 'PRACTICAL'),
-- Tue 11:15-13:15: D1 IPL (PG), D2 IPL (SK), D3 IPL (Sohel Pathan), D4 IPL (AM)
(86, 1, 15, 1, 16, 13, 'PRACTICAL'),
(87, 1, 20, 2, 16, 14, 'PRACTICAL'),
(88, 1, 23, 3, 16, 15, 'PRACTICAL'),
(89, 1, 22, 4, 16, 16, 'PRACTICAL'),
-- Wed 09:00-10:00: D2 EC-Tu (DJP, Rm 203)
(90, 6, 8, 14, 21, 14, 'PRACTICAL'),
-- Wed 09:00-11:00: D4 IC (AV, IC-106)
(91, 4, 32, 11, 23, 16, 'PRACTICAL'),
-- Wed 11:15-12:15: D4 PC (AY, Rm 108)
(92, 7, 36, 13, 24, 16, 'PRACTICAL'),
-- Wed 11:15-13:15: D1 EE (AD), D2 EE (GTH), D3 IC (AV, IC-106)
(93, 5, 37, 9, 26, 13, 'PRACTICAL'),
(94, 5, 38, 10, 26, 14, 'PRACTICAL'),
(95, 4, 32, 11, 26, 15, 'PRACTICAL'),
-- Thu 10:00-11:00: D1 EC-Tu (MN, Rm 101)
(96, 6, 12, 12, 32, 13, 'PRACTICAL'),
-- Thu 11:15-12:15: D1 IC (AV, IC-106), D2 DSM (Prof RGS, DSM Bay 1)
(97, 4, 32, 11, 34, 13, 'PRACTICAL'),
(98, 3, 30, 7, 34, 14, 'PRACTICAL'),
-- Thu 11:15-13:15: D3 EE (AD), D4 EE (SBV)
(99, 5, 37, 9, 36, 15, 'PRACTICAL'),
(100, 5, 31, 10, 36, 16, 'PRACTICAL'),
-- Thu 14:15-15:15: D2 PC (AY, Rm 601), D3 EC-Tu (MN, Rm 101)
(101, 7, 36, 18, 37, 14, 'PRACTICAL'),
(102, 6, 12, 12, 37, 15, 'PRACTICAL'),
-- Fri 14:15-15:15: D3 PC (AY, Rm 101), D4 EC-Tu (CRG, Rm 207)
(103, 7, 36, 12, 47, 15, 'PRACTICAL'),
(104, 6, 11, 22, 47, 16, 'PRACTICAL'),
-- Fri 14:15-16:15: D1 DSM (SW, DSM Bay 1)
(105, 3, 26, 7, 49, 13, 'PRACTICAL'),

-- =================== DIVISION E ===================
-- Mon 09:00-11:00: E1 EP (OP, PHY-Lab), E2 BEE (RRS, BEE-206)
(106, 8, 39, 25, 3, 17, 'PRACTICAL'),
(107, 9, 40, 24, 3, 18, 'PRACTICAL'),
-- Mon 09:00-10:00: E3 PC (SM, Rm 207)
(108, 7, 105, 22, 1, 19, 'PRACTICAL'),
-- Mon 10:00-11:00: E4 EC-Tu (DJP, Rm 601)
(109, 6, 8, 18, 2, 20, 'PRACTICAL'),
-- Tue 09:00-11:00: E1 BEE (SRK, BEE-206), E2 EP (SBV, PHY-Lab)
(110, 9, 104, 24, 13, 17, 'PRACTICAL'),
(111, 8, 31, 25, 13, 18, 'PRACTICAL'),
-- Tue 09:00-10:00: E4 PC (SD, Rm 207)
(112, 7, 34, 22, 11, 20, 'PRACTICAL'),
-- Tue 10:00-11:00: E3 EC-Tu (DJP, Rm 108)
(113, 6, 8, 13, 12, 19, 'PRACTICAL'),
-- Wed 09:00-11:00: E3 EP (SBV, PHY-Lab), E4 BEE (RK, BEE-206)
(114, 8, 31, 25, 23, 19, 'PRACTICAL'),
(115, 9, 27, 24, 23, 20, 'PRACTICAL'),
-- Wed 10:00-11:00: E2 EC-Tu (DJP, Rm 407)
(116, 6, 8, 26, 22, 18, 'PRACTICAL'),
-- Wed 15:15-16:15: E1 PC (SM, Rm 207)
(117, 7, 105, 22, 28, 17, 'PRACTICAL'),
-- Thu 09:00-11:00: E3 BEE (SV, BEE-206), E4 EP (OP, PHY-Lab)
(118, 9, 29, 24, 33, 19, 'PRACTICAL'),
(119, 8, 39, 25, 33, 20, 'PRACTICAL'),
-- Thu 09:00-10:00: E2 PC (SM, Rm 605)
(120, 7, 105, 19, 31, 18, 'PRACTICAL'),
-- Thu 10:00-11:00: E1 EC-Tu (DJP, Rm 207)
(121, 6, 8, 22, 32, 17, 'PRACTICAL'),
-- Fri 09:00-11:00: E1 IPL (KS), E2 IPL (SK), E3 IPL (SP), E4 IPL (NH)
(122, 1, 21, 1, 43, 17, 'PRACTICAL'),
(123, 1, 20, 2, 43, 18, 'PRACTICAL'),
(124, 1, 23, 3, 43, 19, 'PRACTICAL'),
(125, 1, 18, 4, 43, 20, 'PRACTICAL'),

-- =================== DIVISION F ===================
-- Mon 10:00-11:00: F2 EC-Tu (CRG, Rm 409)
(126, 6, 11, 16, 2, 22, 'PRACTICAL'),
-- Mon 14:15-16:15: F2 BEE (SRK, BEE-206)
(127, 9, 104, 24, 9, 22, 'PRACTICAL'),
-- Mon 14:15-15:15: F4 PC (SM, Rm 405)
(128, 7, 105, 28, 7, 24, 'PRACTICAL'),
-- Tue 09:00-10:00: F2 PC (SM, Rm 305)
(129, 7, 105, 27, 11, 22, 'PRACTICAL'),
-- Tue 10:00-11:00: F1 EC-Tu (CRG, Rm 701)
(130, 6, 11, 20, 12, 21, 'PRACTICAL'),
-- Wed 10:00-11:00: F3 EC-Tu (CRG, Rm 409)
(131, 6, 11, 16, 22, 23, 'PRACTICAL'),
-- Wed 14:15-16:15: F1 EP (OP, PHY-Lab), F4 BEE (SV, BEE-206)
(132, 8, 39, 25, 29, 21, 'PRACTICAL'),
(133, 9, 29, 24, 29, 24, 'PRACTICAL'),
-- Thu 09:00-11:00: F1 IPL (PG), F2 IPL (NH), F3 IPL (SP), F4 IPL (AN)
(134, 1, 15, 1, 33, 21, 'PRACTICAL'),
(135, 1, 18, 2, 33, 22, 'PRACTICAL'),
(136, 1, 23, 3, 33, 23, 'PRACTICAL'),
(137, 1, 122, 4, 33, 24, 'PRACTICAL'),
-- Thu 14:15-15:15: F1 PC (SM, Rm 207)
(138, 7, 105, 22, 37, 21, 'PRACTICAL'),
-- Thu 14:15-16:15: F3 BEE (RK, BEE-206), F4 EP (OP, PHY-Lab)
(139, 9, 27, 24, 39, 23, 'PRACTICAL'),
(140, 8, 39, 25, 39, 24, 'PRACTICAL'),
-- Fri 09:00-11:00: F2 EP (OP, PHY-Lab)
(141, 8, 39, 25, 43, 22, 'PRACTICAL'),
-- Fri 09:00-10:00: F3 PC (SM, Rm 002)
(142, 7, 105, 21, 41, 23, 'PRACTICAL'),
-- Fri 10:00-11:00: F4 EC-Tu (CRG, Rm 207)
(143, 6, 11, 22, 42, 24, 'PRACTICAL'),
-- Fri 14:15-16:15: F1 BEE (RRS, BEE-206), F3 EP (OP, PHY-Lab)
(144, 9, 40, 24, 49, 21, 'PRACTICAL'),
(145, 8, 39, 25, 49, 23, 'PRACTICAL'),

-- =================== DIVISION G ===================
-- Mon 11:15-13:15: G1 BEEE (NAB, BEEE-206)
(146, 9, 139, 24, 6, 25, 'PRACTICAL'),
-- Mon 11:15-12:15: G2 PC (DN, Rm 701), G3 EC-Tu (SP, Rm 203)
(147, 7, 33, 20, 4, 26, 'PRACTICAL'),
(148, 6, 10, 14, 4, 27, 'PRACTICAL'),
-- Tue 11:15-12:15: G1 PC (SD, Rm 601), G4 EC-Tu (SP, Rm 605)
(149, 7, 34, 18, 14, 25, 'PRACTICAL'),
(150, 6, 10, 19, 14, 28, 'PRACTICAL'),
-- Tue 11:15-13:15: G2 BEEE (NAB, BEEE-206)
(151, 9, 139, 24, 16, 26, 'PRACTICAL'),
-- Wed 11:15-12:15: G1 EC-Tu (AT, Rm 701), G2 EC-Tu (SP, Rm 405), G4 PC (SD, Rm 101)
(152, 6, 6, 20, 24, 25, 'PRACTICAL'),
(153, 6, 10, 28, 24, 26, 'PRACTICAL'),
(154, 7, 34, 12, 24, 28, 'PRACTICAL'),
-- Wed 11:15-13:15: G3 BEEE (RRS, BEEE-206)
(155, 9, 40, 24, 26, 27, 'PRACTICAL'),
-- Thu 11:15-12:15: G3 PC (SD, Rm 605)
(156, 7, 34, 19, 34, 27, 'PRACTICAL'),
-- Thu 11:15-13:15: G4 BEEE (RRS, BEEE-206)
(157, 9, 40, 24, 36, 28, 'PRACTICAL'),
-- Thu 14:15-16:15: G1 IPL (PG), G2 IPL (SK), G3 IPL (IS), G4 IPL (AK)
(158, 1, 15, 1, 39, 25, 'PRACTICAL'),
(159, 1, 20, 2, 39, 26, 'PRACTICAL'),
(160, 1, 16, 3, 39, 27, 'PRACTICAL'),
(161, 1, 141, 4, 39, 28, 'PRACTICAL'),

-- =================== DIVISION H ===================
-- Mon 10:00-11:00: H1 EC-Tu (RRS, Rm 701)
(162, 6, 13, 20, 2, 29, 'PRACTICAL'),
-- Tue 09:00-10:00: H2 EC-Tu (RRS, Rm 103)
(163, 6, 13, 23, 11, 30, 'PRACTICAL'),
-- Wed 10:00-11:00: H4 EC-Tu (RRS, Rm 701)
(164, 6, 13, 20, 22, 32, 'PRACTICAL'),
-- Wed 11:15-13:15: H1 IPL (KS), H2 IPL (AQ), H3 IPL (SP), H4 IPL (AN)
(165, 1, 21, 1, 26, 29, 'PRACTICAL'),
(166, 1, 17, 2, 26, 30, 'PRACTICAL'),
(167, 1, 23, 3, 26, 31, 'PRACTICAL'),
(168, 1, 122, 4, 26, 32, 'PRACTICAL'),
-- Wed 16:15-17:15: H3 BEEE (RRS, BEE-206)
(169, 9, 40, 24, 30, 31, 'PRACTICAL'),
-- Thu 09:00-10:00: H1 PC (SD, Rm 601)
(170, 7, 34, 18, 31, 29, 'PRACTICAL'),
-- Thu 11:15-12:15: H3 EC-Tu (RRS, Rm 101)
(171, 6, 13, 12, 34, 31, 'PRACTICAL'),
-- Thu 16:15-17:15: H4 BEEE (NAB, BEE-206)
(172, 9, 139, 24, 40, 32, 'PRACTICAL'),
-- Fri 09:00-11:00: H2 BEEE (RRS, BEE-206)
(173, 9, 40, 24, 43, 30, 'PRACTICAL'),
-- Fri 11:15-13:15: H1 BEEE (NAB, BEE-206)
(174, 9, 139, 24, 46, 29, 'PRACTICAL'),
-- Fri 11:15-12:15: H2 PC (SD, Rm 601), H3 PC (SM, Rm 605)
(175, 7, 34, 18, 44, 30, 'PRACTICAL'),
(176, 7, 105, 19, 44, 31, 'PRACTICAL'),
-- Fri 16:15-17:15: H4 PC (SD, Rm 103)
(177, 7, 34, 23, 51, 32, 'PRACTICAL'),

-- =================== SE COMPUTER ENGINEERING DIVISION A ===================
-- Mon 14:15-16:15: A1 COA (JS, 606-4), A2 COA (AVS, 607-B), A3 COA (KB, 608), A4 COA (RS, 702-C)
(178, 15, 179, 29, 9, 33, 'PRACTICAL'),
(179, 15, 190, 31, 9, 34, 'PRACTICAL'),
(180, 15, 183, 32, 9, 35, 'PRACTICAL'),
(181, 15, 19, 33, 9, 36, 'PRACTICAL'),
-- Mon 16:15-18:15: A4 DS (FM, 603-3), A3 Data Sci (CV, 608)
(182, 13, 187, 34, 52, 36, 'PRACTICAL'),
(183, 16, 184, 32, 52, 35, 'PRACTICAL'),
-- Wed 09:00-11:00: A1 DS (AVN, 604), A2 Data Sci (JS, 607-B), A4 Data Sci (AAG, 608)
(184, 13, 177, 35, 23, 33, 'PRACTICAL'),
(185, 16, 179, 31, 23, 34, 'PRACTICAL'),
(186, 16, 178, 32, 23, 36, 'PRACTICAL'),
-- Wed 11:15-13:15: A1 DBMS (KKD, 606-4), A2 DBMS (RHS, 607-B), A3 DBMS (PJB, 606-5), A4 DBMS (JR, 603-7)
(187, 14, 176, 29, 26, 33, 'PRACTICAL'),
(188, 14, 188, 31, 26, 34, 'PRACTICAL'),
(189, 14, 182, 30, 26, 35, 'PRACTICAL'),
(190, 14, 185, 36, 26, 36, 'PRACTICAL'),
-- Wed 16:15-18:15: Open Elective FOSE Lab B1 (NH, 509 Old), B2 (PL, 606-4)
(191, 19, 18, 37, 56, 33, 'PRACTICAL'),
(192, 19, 186, 29, 56, 34, 'PRACTICAL'),
-- Thu 11:15-13:15: A1 DS (AVN, 603-2), A2 Data Sci (JS, 607-B), A3 DS (FM, 603-3), A4 Data Sci (AAG, 608)
(193, 13, 177, 38, 36, 33, 'PRACTICAL'),
(194, 16, 179, 31, 36, 34, 'PRACTICAL'),
(195, 13, 187, 34, 36, 35, 'PRACTICAL'),
(196, 16, 178, 32, 36, 36, 'PRACTICAL'),
-- Thu 14:15-16:15: Open Elective FOSE Lab B3 (NH, 509 Old), Open Elective DBMS Lab (RHS, 607-B)
(197, 19, 18, 37, 39, 35, 'PRACTICAL'),
(198, 14, 188, 31, 39, 36, 'PRACTICAL'),
-- Fri 09:00-11:00: A3 DS (FM, 702-B), A2 DS (AVN, 702-C), A1 Data Sci (PBB, 703-B)
(199, 13, 187, 39, 43, 35, 'PRACTICAL'),
(200, 13, 177, 33, 43, 34, 'PRACTICAL'),
(201, 16, 182, 40, 43, 33, 'PRACTICAL'),
-- Fri 11:15-13:15: A2 DS (AVN, 603-2), A4 DS (FM, 603-3), A1 Data Sci (PBB, 607-B), A3 Data Sci (CV, 702-A)
(202, 13, 177, 38, 46, 34, 'PRACTICAL'),
(203, 13, 187, 34, 46, 36, 'PRACTICAL'),
(204, 16, 182, 31, 46, 33, 'PRACTICAL'),
(205, 16, 184, 41, 46, 35, 'PRACTICAL'),
-- Fri 15:15-16:15: FOM Tutorial (SP, Rm 601)
(206, 18, 10, 18, 48, 33, 'PRACTICAL');

-- ---------------------------------------------------------------------
-- 15. WORKSTATION ALLOCATION (Student seat assignments for practicals)
-- ---------------------------------------------------------------------
INSERT INTO workstation_allocation (schedule_id, student_id, workstation_id) VALUES
-- Schedule 3: CAED in CAED-001 Bay 1 (Workstations 25, 26, 27, 28) for Batch FE-A1 (Students 7, 41, 42, 43)
(3, 7, 25),
(3, 41, 26),
(3, 42, 27),
(3, 43, 28),
-- Schedule 4: CAED in CAED-001 Bay 2 (Workstations 31, 32, 33, 34) for Batch FE-A2 (Students 44, 45, 46, 47)
(4, 44, 31),
(4, 45, 32),
(4, 46, 33),
(4, 47, 34),
-- Schedule 24: IPL in IPL-003 Bay 1 (Workstations 1, 2, 3, 4) for Batch FE-A1 (Students 7, 41, 42, 43)
(24, 7, 1),
(24, 41, 2),
(24, 42, 3),
(24, 43, 4),
-- Schedule 25: IPL in IPL-003 Bay 2 (Workstations 7, 8, 9, 10) for Batch FE-A2 (Students 44, 45, 46, 47)
(25, 44, 7),
(25, 45, 8),
(25, 46, 9),
(25, 47, 10),
-- Schedule 29: IPL in IPL-003 Bay 1 (Workstations 1, 2, 3, 4) for Batch FE-B1 (Students 56, 57, 58, 59)
(29, 56, 1),
(29, 57, 2),
(29, 58, 3),
(29, 59, 4),
-- Schedule 59: IPL in IPL-003 Bay 1 (Workstations 1, 2, 3, 4) for Batch FE-C1 (Students 72, 73, 74, 75)
(59, 72, 1),
(59, 73, 2),
(59, 74, 3),
(59, 75, 4),
-- Schedule 86: IPL in IPL-003 Bay 1 (Workstations 1, 2, 3, 4) for Batch FE-D1 (Students 88, 89, 90, 91)
(86, 88, 1),
(86, 89, 2),
(86, 90, 3),
(86, 91, 4),
-- Schedule 122: IPL in IPL-003 Bay 1 (Workstations 1, 2, 3, 4) for Batch FE-E1 (Students 106, 107, 108, 109)
(122, 106, 1),
(122, 107, 2),
(122, 108, 3),
(122, 109, 4),
-- Schedule 134: IPL in IPL-003 Bay 1 (Workstations 1, 2, 3, 4) for Batch FE-F1 (Students 123, 124, 125, 126)
(134, 123, 1),
(134, 124, 2),
(134, 125, 3),
(134, 126, 4),
-- Schedule 158: IPL in IPL-003 Bay 1 (Workstations 1, 2, 3, 4) for Batch FE-G1 (Students 142, 143, 144, 145)
(158, 142, 1),
(158, 143, 2),
(158, 144, 3),
(158, 145, 4),
-- Schedule 165: IPL in IPL-003 Bay 1 (Workstations 1, 2, 3, 4) for Batch FE-H1 (Students 159, 160, 161, 162)
(165, 159, 1),
(165, 160, 2),
(165, 161, 3),
(165, 162, 4),
-- Schedule 178: COA in Lab-606 Bay 4 (Workstations 99, 100, 101, 102) for Batch SE-CE-A1 (Students 191, 192, 193, 194)
(178, 191, 99),
(178, 192, 100),
(178, 193, 101),
(178, 194, 102);

-- ---------------------------------------------------------------------
-- 16. AD_HOC_REQUEST (Viva sample booking)
-- ---------------------------------------------------------------------
INSERT INTO ad_hoc_request (request_id, faculty_id, lab_id, slot_id, course_id, request_date, status, reason, reviewed_by) VALUES
(1, 14, 1, 4, 1, '2026-10-19', 'APPROVED', 'Make-up Practical session for IPL batch', 1),
(2, 3, 5, 14, 2, '2026-10-20', 'PENDING', 'Additional CAD project evaluation lab', NULL);

-- ---------------------------------------------------------------------
-- 17. ISSUE_REPORT (Defective hardware logs)
-- ---------------------------------------------------------------------
INSERT INTO issue_report (issue_id, workstation_id, reported_by, description, status) VALUES
(1, 5, 7, 'Monitor display flickers during C programming test.', 'OPEN'),
(2, 17, 1, 'CPU cooling fan excessive noise and thermal shutdown.', 'IN_PROGRESS');

-- ---------------------------------------------------------------------
-- 18. NOTIFICATION
-- ---------------------------------------------------------------------
INSERT INTO notification (notification_id, user_id, message, is_read) VALUES
(1, 14, 'Your ad-hoc booking #1 for IPL-003 (Bay 1) on 2026-10-19 was APPROVED.', 1),
(2, 7, 'Welcome to SPIT Automatic Lab Allocation System. Your timetable is active.', 0);

-- ---------------------------------------------------------------------
-- 19. AUDIT_LOG
-- ---------------------------------------------------------------------
INSERT INTO audit_log (action_type, entity_name, entity_id, performed_by, details) VALUES
('DATABASE_SEED', 'system', 1, 'SYSTEM', 'SPIT First Year (A-H) and Second Year Computer Engineering (Division A) timetable database initialized.');
