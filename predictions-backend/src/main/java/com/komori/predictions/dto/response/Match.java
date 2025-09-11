package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Match {
    private Long id;
    private Team homeTeam;
    private Team awayTeam;
    private Instant date;
    private Integer gameweek;
    private Boolean predicted;
}
