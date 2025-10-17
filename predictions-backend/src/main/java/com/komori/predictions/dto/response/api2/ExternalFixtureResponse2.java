package com.komori.predictions.dto.response.api2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalFixtureResponse2 {
    // Used to get the second fixture ID
    private List<FixtureDetails> response;

    @Data
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FixtureDetails {
        private Fixture fixture;
        private Teams teams;

        @Data
        @AllArgsConstructor
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Fixture {
            private Long id;
            private OffsetDateTime date;
        }

        @Data
        @AllArgsConstructor
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Teams {
            private HomeAndAway homeTeam;
            private HomeAndAway awayTeam;

            @Data
            @AllArgsConstructor
            @JsonIgnoreProperties(ignoreUnknown = true)
            public static class HomeAndAway {
                private Integer id;
                private String name;
            }
        }
    }
}
