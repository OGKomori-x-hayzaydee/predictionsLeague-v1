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
public class UserPrediction {
    private Long matchId;
    private String homeTeam;
    private String awayTeam;
    private Integer homeScore;
    private Integer awayScore;
    private Integer actualHomeScore;
    private Integer actualAwayScore;
    private List<String> homeScorers;
    private List<String> awayScorers;
    private List<String> actualHomeScorers;
    private List<String> actualAwayScorers;
    private Integer points;
    private Boolean correct;
    private PredictionStatus status;
    private List<Chip> chips;
    private Instant date;
    private Integer gameweek;

    public UserPrediction(MatchEntity match, PredictionEntity entity) {
        this.matchId = entity.getMatchId();
        this.homeTeam = entity.getHomeTeam();
        this.awayTeam = entity.getAwayTeam();
        this.homeScore = entity.getHomeScore();
        this.awayScore = entity.getAwayScore();
        this.actualHomeScore = match.getHomeScore();
        this.actualAwayScore = match.getAwayScore();
        this.homeScorers = entity.getHomeScorers();
        this.awayScorers = entity.getAwayScorers();
        this.actualHomeScorers = match.getHomeScorers();
        this.actualAwayScorers = match.getAwayScorers();
        this.points = entity.getPoints();
        this.correct = entity.getCorrect();
        this.status = entity.getStatus();
        this.chips = entity.getChips();
        this.date = entity.getDate();
        this.gameweek = entity.getGameweek();
    }

    public UserPrediction(PredictionEntity entity) {
        this.matchId = entity.getMatchId();
        this.homeTeam = entity.getHomeTeam();
        this.awayTeam = entity.getAwayTeam();
        this.homeScore = entity.getHomeScore();
        this.awayScore = entity.getAwayScore();
        this.actualHomeScore = null;
        this.actualAwayScore = null;
        this.homeScorers = entity.getHomeScorers();
        this.awayScorers = entity.getAwayScorers();
        this.actualHomeScorers = null;
        this.actualAwayScorers = null;
        this.points = entity.getPoints();
        this.correct = entity.getCorrect();
        this.status = entity.getStatus();
        this.chips = entity.getChips();
        this.date = entity.getDate();
        this.gameweek = entity.getGameweek();
    }
}
