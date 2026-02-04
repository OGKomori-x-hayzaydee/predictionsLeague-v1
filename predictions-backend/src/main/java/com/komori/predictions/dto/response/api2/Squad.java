package com.komori.predictions.dto.response.api2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Squad {
    private List<SquadList> squads; // usually contains a list of one element

    @Data
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SquadList {
        private Long competitorId;
        private List<Athlete> athletes;

        @Data
        @AllArgsConstructor
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Athlete {
            private Long id;
            private Position position;
            private String name;

            @Data
            @AllArgsConstructor
            @JsonIgnoreProperties(ignoreUnknown = true)
            public static class Position {
                private String name; // Defender, Midfielder, Attacker
            }
        }
    }
}
