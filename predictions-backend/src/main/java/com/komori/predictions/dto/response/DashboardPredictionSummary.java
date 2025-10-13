package com.komori.predictions.dto.response;

import com.komori.predictions.entity.PredictionEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardPredictionSummary {
    private Long matchId;
    private String homeTeam;
    private String awayTeam;
    private Integer homeScore;
    private Integer awayScore;
    private Boolean correct;
    private Integer points;
    private Instant date;
    private Integer gameweek;

    public DashboardPredictionSummary(PredictionEntity entity) {
        this.matchId = entity.getMatchId();
        this.homeTeam = entity.getHomeTeam();
        this.awayTeam = entity.getAwayTeam();
        this.homeScore = entity.getHomeScore();
        this.awayScore = entity.getAwayScore();
        this.correct = entity.getCorrect();
        this.points = entity.getPoints();
        this.date = entity.getDate();
        this.gameweek = entity.getGameweek();
    }
}
