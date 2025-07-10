ALTER TABLE league_entity
    DROP COLUMN publicity;

ALTER TABLE league_entity
    ADD publicity VARCHAR(255);