package com.komori.predictions.dto.request;

import com.komori.predictions.dto.enumerated.Chip;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PredictionRequest {
    private Long matchId;
    private String homeTeam;
    private String awayTeam;
    private Integer homeScore;
    private Integer awayScore;
    private List<String> homeScorers;
    private List<String> awayScorers;
    private List<Chip> chips;
    private Integer gameweek;
}
