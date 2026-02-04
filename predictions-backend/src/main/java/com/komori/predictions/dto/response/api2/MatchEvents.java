package com.komori.predictions.dto.response.api2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MatchEvents {
    private Game game;

    @Data
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Game {
        private List<Event> events;

        @Data
        @AllArgsConstructor
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Event {
            private Long competitorId;
            private Long playerId;
            private EventType eventType;

            @Data
            @AllArgsConstructor
            @JsonIgnoreProperties(ignoreUnknown = true)
            public static class EventType {
                private Integer id;
                private String name;
            }
        }
    }
}
