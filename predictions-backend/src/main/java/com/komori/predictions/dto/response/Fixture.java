package com.komori.predictions.dto.response;

import com.komori.predictions.dto.response.api1.ExternalFixtureResponse1;
import com.komori.predictions.entity.TeamEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Fixture {
    private Integer id;
    private Integer homeId;
    private String homeTeam;
    private Integer awayId;
    private String awayTeam;
    private OffsetDateTime date;
    private String competition;
    private String status;
    private String venue;
    private Integer gameweek;
    private Integer homeScore;
    private Integer awayScore;
    private List<Player> homePlayers;
    private List<Player> awayPlayers;
    private Integer externalFixtureId;

    public Fixture(ExternalFixtureResponse1.Match match, TeamEntity homeTeamEntity, TeamEntity awayTeamEntity) {
        this.id = match.getId();
        this.homeId = homeTeamEntity.getTeamId();
        this.homeTeam = homeTeamEntity.getName();
        this.awayId = awayTeamEntity.getTeamId();
        this.awayTeam = awayTeamEntity.getName();
        this.date = match.getUtcDate();
        this.competition = "Premier League";
        this.status = match.getStatus();
        this.venue = homeTeamEntity.getVenue();
        this.gameweek = match.getMatchday();
        this.homePlayers = new ArrayList<>();
        this.awayPlayers = new ArrayList<>();
    }
}
