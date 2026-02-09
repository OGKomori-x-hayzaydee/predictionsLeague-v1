package com.komori.predictions.dto.response.api1;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalFixtureResponse1 {
    private List<Match> matches;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Match {
        private Integer id;
        private OffsetDateTime utcDate;
        private String status;
        private Integer matchday;
        private Team homeTeam;
        private Team awayTeam;
        private Score score;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Team {
            private String shortName;
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Score {
            private HomeAwayScore fullTime;
            private HomeAwayScore halfTime;

            @Data
            @JsonIgnoreProperties(ignoreUnknown = true)
            public static class HomeAwayScore {
                private Integer home;
                private Integer away;
            }
        }
    }
}
