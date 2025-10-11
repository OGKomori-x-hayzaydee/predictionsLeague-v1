package com.komori.predictions.dto.response;

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
public class ExternalFixtureResponse {
    private Filters filters;
    private ResultSet resultSet;
    private Competition competition;
    private List<Match> matches;

    @Data
    public static class Filters {
        private String season;
        private String matchday;
    }

    @Data
    public static class ResultSet {
        private Integer count;
        private String first;
        private String last;
        private Integer played;
    }

    @Data
    public static class Competition {
        private Integer id;
        private String name;
        private String code;
        private String type;
        private String emblem;
    }

    @Data
    public static class Match {
        private Area area;
        private Competition competition;
        private Season season;
        private Integer id;
        private OffsetDateTime utcDate;
        private String status;
        private Integer matchday;
        private String stage;
        private String group;
        private OffsetDateTime lastUpdated;
        private Team homeTeam;
        private Team awayTeam;
        private Score score;
        private Odds odds;
        private List<Referee> referees;

        @Data
        public static class Area {
            private Integer id;
            private String name;
            private String code;
            private String flag;
        }

        @Data
        public static class Season {
            private Integer id;
            private String startDate;
            private String endDate;
            private Integer currentMatchday;
            private String winner;
        }

        @Data
        public static class Team {
            private Integer id;
            private String name;
            private String shortName;
            private String tla;
            private String crest;
        }

        @Data
        public static class Score {
            private String winner;
            private String duration;
            private HomeAwayScore fullTime;
            private HomeAwayScore halfTime;

            @Data
            public static class HomeAwayScore {
                private Integer home;
                private Integer away;
            }
        }

        @Data
        public static class Odds {
            private String msg;
        }

        @Data
        public static class Referee {
            private Integer id;
            private String name;
            private String type;
            private String nationality;
        }
    }
}
