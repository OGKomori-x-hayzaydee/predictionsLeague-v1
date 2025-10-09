package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Team;

public interface TeamPerformanceProjection {
    Team getTeam();

    Integer getTotal();

    Integer getCorrect();

    Integer getPoints();
}
