-- ============================================================
-- KDU Student Management System — Complete PostgreSQL Script
-- Version: 1.0  |  2026-03-03
--
-- Usage (local development):
--   1. Create the role and database (run as postgres superuser):
--        CREATE ROLE sms_user WITH LOGIN PASSWORD 'sms_pass';
--        CREATE DATABASE sms_db OWNER sms_user;
--   2. Connect to sms_db and run this file:
--        \c sms_db
--        \i database/schema.sql
--
-- Docker: This is automatically executed via docker-compose.yml
--   init.sql → 01, seed.sql → 02 (or run this file as a single script)
-- ============================================================

-- ============================================================
-- 0. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- for gen_random_uuid()

-- ============================================================
-- 1. TABLES
-- ============================================================

-- Users (administrators who log in)
CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(36)  PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) DEFAULT 'Administrator'
);

-- Students
CREATE TABLE IF NOT EXISTS students (
    id             VARCHAR(36)  PRIMARY KEY,
    student_number VARCHAR(50)  UNIQUE NOT NULL,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    address        TEXT         NOT NULL,
    birthday       VARCHAR(20)  NOT NULL,
    degree_program VARCHAR(20)  NOT NULL,
    status         VARCHAR(20)  NOT NULL DEFAULT 'Active'
                       CHECK (status IN ('Active', 'Inactive')),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id          VARCHAR(36)  PRIMARY KEY,
    course_code VARCHAR(20)  UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits     INTEGER      NOT NULL CHECK (credits > 0)
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id         VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id  VARCHAR(36) NOT NULL REFERENCES courses(id)  ON DELETE CASCADE,
    semester   VARCHAR(50) NOT NULL,
    year       INTEGER     NOT NULL CHECK (year >= 2000),
    status     VARCHAR(20) NOT NULL DEFAULT 'Enrolled'
                   CHECK (status IN ('Enrolled', 'Completed', 'Dropped')),
    UNIQUE (student_id, course_id, semester, year)
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id           VARCHAR(36) PRIMARY KEY,
    timestamp    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    action_type  VARCHAR(50) NOT NULL,
    entity       VARCHAR(50) NOT NULL,
    entity_id    VARCHAR(255) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    old_value    TEXT DEFAULT '',
    new_value    TEXT DEFAULT ''
);

-- ============================================================
-- 2. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_students_student_number ON students(student_number);
CREATE INDEX IF NOT EXISTS idx_students_status         ON students(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id  ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id   ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp         ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity            ON audit_logs(entity);

-- ============================================================
-- 3. AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_students_updated_at ON students;
CREATE TRIGGER trg_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 4. SEED DATA — COURSES
-- ============================================================
INSERT INTO courses (id, course_code, course_name, credits) VALUES
    ('c-001', 'CS101',  'Introduction to Computing',       3),
    ('c-002', 'CS102',  'Data Structures and Algorithms',  3),
    ('c-003', 'CS201',  'Object-Oriented Programming',     3),
    ('c-004', 'CS202',  'Database Management Systems',     3),
    ('c-005', 'CS301',  'Software Engineering',            3),
    ('c-006', 'CS302',  'Operating Systems',               3),
    ('c-007', 'CS401',  'Artificial Intelligence',         3),
    ('c-008', 'CS402',  'Web Development',                 3),
    ('c-009', 'MATH101','Calculus I',                      4),
    ('c-010', 'MATH102','Linear Algebra',                  3),
    ('c-011', 'ENG101', 'Technical Writing',               2),
    ('c-012', 'PHY101', 'Physics I',                       4)
ON CONFLICT (course_code) DO NOTHING;

-- ============================================================
-- 5. SEED DATA — STUDENTS
-- ============================================================
INSERT INTO students (id, student_number, first_name, last_name, address, birthday, degree_program, status, created_at, updated_at) VALUES
    ('s-001','SMS-2025-0001','Maria',  'Santos',  '123 Rizal St, Quezon City',        '2003-05-15','BSCS',  'Active',   '2025-01-15T08:00:00Z','2025-01-15T08:00:00Z'),
    ('s-002','SMS-2025-0002','Juan',   'Dela Cruz','456 Bonifacio Ave, Manila',        '2002-08-22','BSIT',  'Active',   '2025-01-16T09:30:00Z','2025-02-01T10:00:00Z'),
    ('s-003','SMS-2025-0003','Ana',    'Reyes',   '789 Mabini Blvd, Makati',          '2003-01-10','BSCS',  'Active',   '2025-01-17T11:00:00Z','2025-01-17T11:00:00Z'),
    ('s-004','SMS-2025-0004','Carlos', 'Garcia',  '321 Luna St, Pasig',               '2001-11-30','BSCpE', 'Active',   '2025-01-20T14:00:00Z','2025-01-20T14:00:00Z'),
    ('s-005','SMS-2025-0005','Liza',   'Morales', '555 Aguinaldo Highway, Cavite',    '2002-03-25','BSDS',  'Inactive', '2025-01-22T08:30:00Z','2025-02-10T09:00:00Z'),
    ('s-006','SMS-2025-0006','Miguel', 'Torres',  '88 Katipunan Ave, Quezon City',    '2003-07-18','BSIS',  'Active',   '2025-02-01T10:00:00Z','2025-02-01T10:00:00Z'),
    ('s-007','SMS-2025-0007','Sofia',  'Cruz',    '12 Commonwealth Ave, QC',          '2002-12-05','BSCyS', 'Active',   '2025-02-05T13:00:00Z','2025-02-05T13:00:00Z'),
    ('s-008','SMS-2025-0008','Rafael', 'Mendoza', '77 EDSA, Mandaluyong',             '2001-09-14','BSIT',  'Active',   '2025-02-10T08:00:00Z','2025-02-10T08:00:00Z')
ON CONFLICT (student_number) DO NOTHING;

-- ============================================================
-- 6. SEED DATA — ENROLLMENTS
-- ============================================================
INSERT INTO enrollments (id, student_id, course_id, semester, year, status) VALUES
    ('e-001','s-001','c-001','1st Semester',2025,'Enrolled'),
    ('e-002','s-001','c-002','1st Semester',2025,'Enrolled'),
    ('e-003','s-001','c-009','1st Semester',2025,'Enrolled'),
    ('e-004','s-002','c-001','1st Semester',2025,'Enrolled'),
    ('e-005','s-002','c-003','1st Semester',2025,'Enrolled'),
    ('e-006','s-001','c-003','2nd Semester',2024,'Completed'),
    ('e-007','s-001','c-011','2nd Semester',2024,'Completed'),
    ('e-008','s-003','c-004','1st Semester',2025,'Enrolled'),
    ('e-009','s-003','c-005','1st Semester',2025,'Enrolled'),
    ('e-010','s-004','c-001','1st Semester',2025,'Enrolled'),
    ('e-011','s-004','c-012','1st Semester',2025,'Enrolled'),
    ('e-012','s-004','c-009','1st Semester',2025,'Enrolled'),
    ('e-013','s-005','c-001','1st Semester',2025,'Enrolled'),
    ('e-014','s-005','c-009','1st Semester',2025,'Enrolled'),
    ('e-015','s-005','c-010','1st Semester',2025,'Enrolled'),
    ('e-016','s-006','c-003','1st Semester',2025,'Enrolled'),
    ('e-017','s-006','c-004','1st Semester',2025,'Enrolled'),
    ('e-018','s-006','c-011','1st Semester',2025,'Enrolled'),
    ('e-019','s-007','c-005','1st Semester',2025,'Enrolled'),
    ('e-020','s-007','c-006','1st Semester',2025,'Enrolled'),
    ('e-021','s-007','c-007','1st Semester',2025,'Enrolled'),
    ('e-022','s-008','c-008','1st Semester',2025,'Enrolled'),
    ('e-023','s-008','c-005','1st Semester',2025,'Enrolled'),
    ('e-024','s-008','c-011','1st Semester',2025,'Enrolled')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. SEED DATA — AUDIT LOGS
-- ============================================================
INSERT INTO audit_logs (id, timestamp, action_type, entity, entity_id, performed_by, old_value, new_value) VALUES
    ('al-001','2025-02-28T14:32:00Z','Create','Student',    'SMS-2025-0008','admin@university.edu','',                                        '{"firstName":"Rafael","lastName":"Mendoza","degreeProgram":"BSIT"}'),
    ('al-002','2025-02-27T10:15:00Z','Enroll','Enrollment', 'SMS-2025-0007','admin@university.edu','',                                        '{"courses":["CS301","CS302","CS401"],"semester":"1st Semester","year":2025}'),
    ('al-003','2025-02-25T09:00:00Z','Update','Student',    'SMS-2025-0002','admin@university.edu','{"address":"456 Bonifacio Ave"}',          '{"address":"456 Bonifacio Ave, Manila"}'),
    ('al-004','2025-02-20T16:45:00Z','Create','Course',     'CS402',         'admin@university.edu','',                                        '{"courseCode":"CS402","courseName":"Web Development","credits":3}'),
    ('al-005','2025-02-18T11:30:00Z','Delete','Student',    'SMS-2025-0005','admin@university.edu','{"firstName":"Liza","lastName":"Morales","status":"Active"}','{"status":"Inactive"}'),
    ('al-006','2025-02-15T08:20:00Z','Create','Student',    'SMS-2025-0006','admin@university.edu','',                                        '{"firstName":"Miguel","lastName":"Torres","degreeProgram":"BSIS"}'),
    ('al-007','2025-02-10T13:10:00Z','Update','Course',     'CS301',         'admin@university.edu','{"credits":2}',                          '{"credits":3}'),
    ('al-008','2025-02-08T07:55:00Z','Enroll','Enrollment', 'SMS-2025-0003','admin@university.edu','',                                        '{"courses":["CS202","CS301","MATH102"],"semester":"1st Semester","year":2025}'),
    ('al-009','2025-02-05T15:00:00Z','Create','Student',    'SMS-2025-0007','admin@university.edu','',                                        '{"firstName":"Sofia","lastName":"Cruz","degreeProgram":"BSCyS"}'),
    ('al-010','2025-01-30T09:45:00Z','Create','Course',     'PHY101',        'admin@university.edu','',                                        '{"courseCode":"PHY101","courseName":"Physics I","credits":4}')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8. DEFAULT ADMIN USER
--    Password: admin123
--    Hashed with bcrypt (cost 12)
--    Re-run safe: won't insert if email already exists
-- ============================================================
INSERT INTO users (id, email, hashed_password, full_name)
VALUES (
    gen_random_uuid()::text,
    'admin@university.edu',
    '$2b$12$gg4t/7v197QadtXGQr.Akui.I4jxKE2aIPGtDjAJq5MgxDiGCHfV6',  -- admin123
    'Administrator'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Done! Connect to the app at http://localhost:8080
-- Login: admin@university.edu / admin123
-- ============================================================
