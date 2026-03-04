-- ============================================================
-- Run this as postgres superuser ONCE to create user + database
-- ============================================================

-- Create the role if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sms_user') THEN
        CREATE ROLE sms_user WITH LOGIN PASSWORD 'sms_pass';
    END IF;
END
$$;

-- Create the database if not exists
SELECT 'CREATE DATABASE sms_db OWNER sms_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sms_db')\gexec
