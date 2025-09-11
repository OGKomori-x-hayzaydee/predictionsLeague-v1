package com.komori.predictions.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardEssentials {
    private User user;
    private Season season;
    private Stats stats;

    @Data
    @AllArgsConstructor
    public static class User {
        String username;
        String avatar;
        Integer points;
        Integer predictions;
        Integer pendingPredictions;
    }

    @Data
    @AllArgsConstructor
    public static class Season {
        Integer currentGameweek;
        Integer totalGameweeks;
        String deadlineFormatted;
    }

    @Data
    @AllArgsConstructor
    public static class Stats {
        private WeeklyPoints weeklyPoints;
        private AccuracyRate accuracyRate;
        private AvailableChips availableChips;
        private GlobalRank globalRank;

        @Data
        @AllArgsConstructor
        public static class WeeklyPoints {
            Integer value;
            Integer rank;
            Integer difference;
        }

        @Data
        @AllArgsConstructor
        public static class AccuracyRate {
            Double percentage;
            Integer correct;
        }

        @Data
        @AllArgsConstructor
        public static class AvailableChips {
            Integer value;
            String subtitle;
        }

        @Data
        @AllArgsConstructor
        public static class GlobalRank {
            Integer value;
            Double percentile;
        }
    }
}
