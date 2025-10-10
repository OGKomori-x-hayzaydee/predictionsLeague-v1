package com.komori.predictions.dto.response;

import com.komori.predictions.dto.projection.MonthlyPerformanceProjection;
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

        public MonthlyPerformance(MonthlyPerformanceProjection projection) {
            this.month = mapMonth(projection.getMonth());
            this.predictions = projection.getTotal();
            this.accuracy = (projection.getTotal() == 0) ? 0.0 : ((projection.getCorrect() * 100.0)/projection.getTotal());
            this.points = projection.getPoints();
        }

        private String mapMonth(int month) {
            switch (month) {
                case 1 -> {return "Jan";}
                case 2 -> {return "Feb";}
                case 3 -> {return "Mar";}
                case 4 -> {return "Apr";}
                case 5 -> {return "May";}
                case 6 -> {return "Jun";}
                case 7 -> {return "Jul";}
                case 8 -> {return "Aug";}
                case 9 -> {return "Sep";}
                case 10 -> {return "Oct";}
                case 11 -> {return "Nov";}
                case 12 -> {return "Dec";}
                default -> {
                    return "Null";
                }
            }
        }
    }
}
