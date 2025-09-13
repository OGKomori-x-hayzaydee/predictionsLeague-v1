ALTER TABLE prediction_entity
    ADD uuid VARCHAR(255);

ALTER TABLE prediction_entity
    ADD home_scorers TEXT[];

ALTER TABLE prediction_entity
    ADD away_scorers TEXT[];

ALTER TABLE prediction_entity
    ADD status VARCHAR(255);