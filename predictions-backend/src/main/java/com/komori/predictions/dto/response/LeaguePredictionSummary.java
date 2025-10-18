package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Chip;
import com.komori.predictions.dto.enumerated.PredictionStatus;
import com.komori.predictions.entity.MatchEntity;
import com.komori.predictions.entity.PredictionEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaguePredictionSummary {
    private Long matchId;
    private String userId;
    private String homeTeam;
    private String awayTeam;
    private Integer homeScore;
    private Integer awayScore;
    private List<String> homeScorers;
    private List<String> awayScorers;
    private Integer actualHomeScore;
    private Integer actualAwayScore;
    private List<String> actualHomeScorers;
    private List<String> actualAwayScorers;
    private Boolean correct;
    private Integer points;
    private Integer gameweek;
    private String venue;
    private PredictionStatus status;
    private List<Chip> chips;
    private Instant predictedAt;

    public LeaguePredictionSummary(PredictionEntity prediction, MatchEntity match) {
        this.matchId = prediction.getMatchId();
        this.userId = prediction.getUser().getUUID();
        this.homeTeam = prediction.getHomeTeam();
        this.awayTeam = prediction.getAwayTeam();
        this.homeScore = prediction.getHomeScore();
        this.awayScore = prediction.getAwayScore();
        this.homeScorers = prediction.getHomeScorers();
        this.awayScorers = prediction.getAwayScorers();
        if (match != null) {
            this.actualHomeScore = match.getHomeScore();
            this.actualAwayScore = match.getAwayScore();
            this.actualHomeScorers = match.getHomeScorers();
            this.actualAwayScorers = match.getAwayScorers();
            this.venue = match.getVenue();
        }
        this.correct = prediction.getCorrect();
        this.points = prediction.getPoints();
        this.gameweek = prediction.getGameweek();
        this.status = prediction.getStatus();
        this.chips = prediction.getChips();
        this.predictedAt = prediction.getDate();
    }
}
