ALTER TABLE user_entity
    DROP COLUMN userid;

ALTER TABLE user_entity
    ADD uuid VARCHAR(255);