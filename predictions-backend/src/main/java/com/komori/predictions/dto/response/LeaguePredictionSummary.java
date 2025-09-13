package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Chip;
import com.komori.predictions.dto.enumerated.Status;
import com.komori.predictions.dto.enumerated.Team;
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
    private String id;
    private Long matchId;
    private String userId;
    private Team homeTeam;
    private Team awayTeam;
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
    private Instant date;
    private Integer gameweek;
    private String venue;
    private Status status;
    private List<Chip> chips;
    private Instant predictedAt;
}
