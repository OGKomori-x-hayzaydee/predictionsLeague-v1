package com.komori.predictions.dto.response;

import com.komori.predictions.dto.enumerated.Team;
import com.komori.predictions.dto.projection.TeamPerformanceProjection;
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

        public TeamPerformance(TeamPerformanceProjection projection) {
            this.team = mapStringToTeam(projection.getTeam());
            this.predictions = projection.getTotal();
            this.correct = projection.getCorrect();
            this.accuracy = (projection.getTotal() == 0) ? 0.0 : ((projection.getCorrect() * 100.0)/projection.getTotal());
            this.accuracy = Math.round(this.accuracy * 100.0) / 100.0;
            this.points = projection.getPoints();
        }

        private Team mapStringToTeam(String team) {
            if (team.equalsIgnoreCase("arsenal")) {
                return Team.ARSENAL;
            }
            if (team.equalsIgnoreCase("chelsea")) {
                return Team.CHELSEA;
            }
            if (team.equalsIgnoreCase("liverpool")) {
                return Team.LIVERPOOL;
            }
            if (team.equalsIgnoreCase("tottenham")) {
                return Team.SPURS;
            }
            if (team.equalsIgnoreCase("man city")) {
                return Team.MANCITY;
            }
            return Team.MANUTD;
        }
    }
}
