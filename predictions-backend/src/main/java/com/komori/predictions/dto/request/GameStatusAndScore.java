package com.komori.predictions.dto.request;

import com.komori.predictions.dto.enumerated.GameStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameStatusAndScore {
    private GameStatus gameStatus;
    private Integer homeScore;
    private Integer awayScore;
}
