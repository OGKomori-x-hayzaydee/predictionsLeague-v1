ALTER TABLE chips
    ADD last_used_gameweek INTEGER;

ALTER TABLE chips
    ADD remaining_gameweeks INTEGER;

ALTER TABLE chips
    ADD season_limit INTEGER;

ALTER TABLE chips
    ADD season_usage_count INTEGER;

ALTER TABLE chips
    DROP COLUMN cooldown_remaining;

ALTER TABLE chips
    DROP COLUMN last_gameweek_used;