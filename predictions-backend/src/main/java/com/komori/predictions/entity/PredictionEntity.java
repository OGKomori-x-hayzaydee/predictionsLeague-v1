package com.komori.predictions.entity;

import com.komori.predictions.dto.enumerated.Chip;
import com.komori.predictions.dto.enumerated.Status;
import com.komori.predictions.dto.request.PredictionRequest;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "predictions", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","match_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id")
    private UserEntity user;
    private Long matchId;
    private String homeTeam;
    private String awayTeam;
    private Integer homeScore;
    private Integer awayScore;
    private List<String> homeScorers;
    private List<String> awayScorers;
    private Integer points;
    private Boolean correct;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private List<Chip> chips;
    private Instant date;
    private Integer gameweek;

    public PredictionEntity(UserEntity user, PredictionRequest request) {
        this.user = user;
        this.matchId = request.getMatchId();
        this.homeTeam = request.getHomeTeam();
        this.awayTeam = request.getAwayTeam();
        this.homeScore = request.getHomeScore();
        this.awayScore = request.getAwayScore();
        this.homeScorers = request.getHomeScorers();
        this.awayScorers = request.getAwayScorers();
        this.points = 0;
        this.correct = false;
        this.status = Status.PENDING;
        this.chips = request.getChips();
        this.date = Instant.now();
        this.gameweek = request.getGameweek();
    }
}
