package com.komori.predictions.dto.projection;

public interface TeamPerformanceProjection {
    String getTeam();

    Integer getTotal();

    Integer getCorrect();

    Integer getPoints();
}
