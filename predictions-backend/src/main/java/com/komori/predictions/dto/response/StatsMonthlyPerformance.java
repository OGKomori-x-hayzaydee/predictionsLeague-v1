package com.komori.predictions.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsMonthlyPerformance {
    private List<MonthlyPerformance> data;

    @Data
    @AllArgsConstructor
    public static class MonthlyPerformance {
        private String month;
        private Integer points;
        private Integer predictions;
        private Double accuracy;
    }
}
