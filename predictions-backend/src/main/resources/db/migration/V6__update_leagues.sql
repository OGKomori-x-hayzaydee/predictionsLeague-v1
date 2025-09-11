ALTER TABLE league_entity
    ADD created_at TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE league_entity
    ADD description VARCHAR(255);

ALTER TABLE league_entity
    ADD status VARCHAR(255);

ALTER TABLE user_league_table
    ADD is_admin BOOLEAN;

ALTER TABLE user_league_table
    ADD is_owner BOOLEAN;

CREATE UNIQUE INDEX IX_pk_user_league_table ON user_league_table (user_id, league_id);
