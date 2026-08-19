TRUNCATE TABLE players;

ALTER TABLE matches
    DROP COLUMN match_id,
    ALTER COLUMN old_fixture_id TYPE BIGINT;

ALTER TABLE matches
    RENAME COLUMN old_fixture_id TO match_id;