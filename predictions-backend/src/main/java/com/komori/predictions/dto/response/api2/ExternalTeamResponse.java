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
public class ExternalTeamResponse {
    private List<Squad> response;

    @Data
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Squad {
        private Team team;
        private List<Player> players;

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
            private String position;
        }
    }
}
