package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsTeamPerformance {
    private List<TeamPerformance> data;

    @Data
    @AllArgsConstructor
    public static class TeamPerformance {
        private Team team;
        private Integer predictions;
        private Integer correct;
        private Double accuracy;
        private Integer points;
    }
}
