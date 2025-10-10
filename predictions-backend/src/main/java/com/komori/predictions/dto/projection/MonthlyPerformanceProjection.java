package com.komori.predictions.dto.projection;

public interface MonthlyPerformanceProjection {
    Integer getMonth();

    Integer getTotal();

    Integer getCorrect();

    Integer getPoints();
}
