package com.komori.predictions.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsHighlights {
    private StatsHighlightsGameweek bestGameweek;
    private StatsHighlightsFixture favoriteFixture;
    private StatsHighlightsDay mostActiveDay;

    @Data
    @Builder
    public static class StatsHighlightsGameweek {
        private String gameweek;
        private Integer points;
    }
    @Data
    @Builder
    public static class StatsHighlightsFixture {
        private String fixture;
        private Double accuracy;
    }
    @Data
    @Builder
    public static class StatsHighlightsDay {
        private String day;
        private Double percentage;
    }
}
