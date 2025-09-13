package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Team;
import com.komori.predictions.entity.PredictionEntity;
import jakarta.persistence.*;
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
    private String id;
    private String userId;
    private Long matchId;
    @Enumerated(value = EnumType.STRING)
    private Team homeTeam;
    @Enumerated(value = EnumType.STRING)
    private Team awayTeam;
    private Integer homeScore;
    private Integer awayScore;
    private Boolean correct;
    private Integer points;
    private Instant date;
    private Integer gameweek;

    public DashboardPredictionSummary(PredictionEntity entity) {
        this.id = entity.getUuid();
        this.userId = entity.getUser().getUserID();
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
