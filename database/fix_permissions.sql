-- Fix: Grant sms_user full access to all tables and sequences in sms_db
-- Run this as postgres superuser:
--   psql -U postgres -d sms_db -f database/fix_permissions.sql

-- Transfer ownership of all tables to sms_user
ALTER TABLE users       OWNER TO sms_user;
ALTER TABLE students    OWNER TO sms_user;
ALTER TABLE courses     OWNER TO sms_user;
ALTER TABLE enrollments OWNER TO sms_user;
ALTER TABLE audit_logs  OWNER TO sms_user;

-- Grant all privileges on existing tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO sms_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sms_user;

-- Ensure future tables/sequences are also auto-granted
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO sms_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO sms_user;
