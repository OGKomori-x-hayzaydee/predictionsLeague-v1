package com.komori.predictions.dto.response.api2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ExternalFixtureResponse2 {
    // Used to get the second fixture ID
    private List<FixtureDetails> details;

    @Data
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class FixtureDetails {
        private Integer matchId;
        private Integer matchHometeamId;
        private String matchHometeamName;
        private Integer matchAwayteamId;
        private String matchAwayteamName;
        private List<Goalscorer> goalscorer;

        @Data
        @AllArgsConstructor
        @JsonIgnoreProperties(ignoreUnknown = true)
        @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
        public static class Goalscorer {
            private String homeScorer;
            private String awayScorer;
        }
    }
}
