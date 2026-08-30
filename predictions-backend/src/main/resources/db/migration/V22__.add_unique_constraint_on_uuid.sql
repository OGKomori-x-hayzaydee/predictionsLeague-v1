ALTER TABLE users
    ADD CONSTRAINT uc_users_uuid UNIQUE (uuid);