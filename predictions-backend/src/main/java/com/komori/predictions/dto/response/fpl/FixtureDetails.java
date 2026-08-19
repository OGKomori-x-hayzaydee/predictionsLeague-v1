package com.komori.predictions.dto.response.fpl;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class FixtureDetails {
    private Long id;
    @JsonProperty("event")
    private Integer gameweek;
    @JsonProperty("kickoff_time")
    private OffsetDateTime date;
    @JsonProperty("team_h")
    private Integer homeId;
    @JsonProperty("team_a")
    private Integer awayId;
    @JsonProperty("team_h_score")
    private Integer homeScore;
    @JsonProperty("team_a_score")
    private Integer awayScore;
    private Boolean started;
    @JsonProperty("finished_provisional")
    private Boolean finished;
    private List<Event> stats;

    @Data
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Event {
        private String identifier;
        @JsonProperty("h")
        private List<PlayerAndGoals> home;
        @JsonProperty("a")
        private List<PlayerAndGoals> away;

        @Data
        @AllArgsConstructor
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class PlayerAndGoals {
            @JsonProperty("value")
            private Integer goals;
            @JsonProperty("element")
            private Long playerId;
        }
    }
}
