package com.komori.predictions.dto.response.api2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
public class ExternalEventsResponse {
    private List<Goal> response;

    @Data
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Goal {
        private Team team;
        private Player player;
        private String type;
        private String detail;

        @Data
        @AllArgsConstructor
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Team {
            private Integer id;
            private String name;
        }

        @Data
        @AllArgsConstructor
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Player {
            private Integer id;
            private String name;
        }
    }
}
