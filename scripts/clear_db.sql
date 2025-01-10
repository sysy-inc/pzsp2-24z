-- Drop all tables
DO $$
BEGIN
    EXECUTE (
        SELECT string_agg('DROP TABLE IF EXISTS ' || table_schema || '.' || table_name || ' CASCADE;', ' ')
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    );
END $$;

-- Drop all views
DO $$
BEGIN
    EXECUTE (
        SELECT string_agg('DROP VIEW IF EXISTS ' || table_schema || '.' || table_name || ' CASCADE;', ' ')
        FROM information_schema.views
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    );
END $$;

-- Drop all sequences
DO $$
BEGIN
    EXECUTE (
        SELECT string_agg('DROP SEQUENCE IF EXISTS ' || sequence_schema || '.' || sequence_name || ' CASCADE;', ' ')
        FROM information_schema.sequences
        WHERE sequence_schema NOT IN ('pg_catalog', 'information_schema')
    );
END $$;
